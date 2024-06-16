import { BaseManager } from "#/base/manager/manager.class";
import { ButtonComponent } from "#/base/message_component/button/button.class";
import { ModalSubmitComponent } from "#/base/message_component/modal_submit/modal_submit.class";
import type { Component } from "#/base/message_component/base/base_component.type";
import { SelectMenu } from "#/base/message_component/select_menu/select_menu.class";
import type {
  AnySelectMenuInteraction,
  ButtonInteraction,
  EmbedBuilder,
  Interaction,
  MessageComponentInteraction,
  ModalSubmitInteraction
} from "discord.js";
import { CUSTOM_ID_SEPARATOR } from "#/base/message_component/base/base_component.const";
import { anyToError } from "#/utils/error/error.util";
import { authorOnly, internalErrorEmbed } from "#/utils/discord/embed/embed.const";
import { ButtonError } from "#/utils/error/class/button_error";
import { SelectMenuError } from "#/utils/error/class/select_menu_error";
import { ModalSubmitError } from "#/utils";

export class ComponentManager extends BaseManager {

  name = "components";

  buttons: Map<string, ButtonComponent> = new Map();

  selectMenus: Map<string, SelectMenu> = new Map();

  modalSubmit: Map<string, ModalSubmitComponent> = new Map();

  loadComponents(components: Component[]): void {
    components.forEach(component => this.loadComponent(component));
  }

  loadComponent(component: Component): void {
    if (typeof this.validCustomID(component.customId) === "string") {
      return this.logger.error(`component ${component.name} (${component.type}) don't have a valid id : ${this.validCustomID(component.customId)}`);
    }


    if (component.type === "button" && component instanceof ButtonComponent) {
      return this.loadButton(component);
    }

    if (component.type === "modalSubmit" && component instanceof ModalSubmitComponent) {
      return this.loadModalSubmit(component);
    }

    if (component.type === "selectMenu" && component instanceof SelectMenu) {
      return this.loadSelectMenu(component);
    }
  }

  loadButton(component: ButtonComponent): void {
    if (this.buttons.has(component.name)) {
      return this.logger.warning(`Button component ${component.name} already exists/registered`);
    }

    this.logger.trace(`loaded button component ${component.name}`);
    this.buttons.set(component.name, component);
  }

  loadModalSubmit(component: ModalSubmitComponent): void {
    if (this.modalSubmit.has(component.name)) {
      return this.logger.warning(`Modal submit component ${component.name} already exists/registered`);
    }

    this.logger.trace(`loaded modal submit component ${component.name}`);
    this.modalSubmit.set(component.name, component);
  }

  loadSelectMenu(component: SelectMenu): void {
    if (this.selectMenus.has(component.name)) {
      return this.logger.warning(`Select menu component ${component.name} already exists/registered`);
    }

    this.logger.trace(`loaded select menu component ${component.name}`);
    this.selectMenus.set(component.name, component);
  }

  handleInteraction(interaction: Interaction): void {
    if (interaction.isButton()) {
      void this.handleButton(interaction);
    }
    if (interaction.isAnySelectMenu()) {
      void this.handleSelectMenu(interaction);
    }
    if (interaction.isModalSubmit()) {
      void this.handleModalSubmit(interaction);
    }
  }

  async handleButton(interaction: ButtonInteraction): Promise<void> {
    const customId = this.getCustomID(interaction);
    const button = this.buttons.get(customId);
    if (!button) {
      this.logger.warning(`Button component ${customId} does not exist/registered`);
      await this.sendError(interaction, internalErrorEmbed());
      return;
    }

    if (button.authorOnly && interaction.message.interaction) {
      if (interaction.user.id !== interaction.message.interaction.user.id) {
        this.logger.trace(`${interaction.user.username} (${interaction.user.id}) run button for `
          + `${interaction.message.interaction.user.id}, ${interaction.user.id} that are author only`);
      }
      await this.sendError(interaction, authorOnly());
      return;
    }

    const defer = button.defaultReplyOptions.preReply;
    if (defer) {
      try {
        await interaction.deferReply({
          ephemeral: button.defaultReplyOptions.ephemeral,
        });
      } catch (e) {
        const error = new ButtonError({
          message: "failed to pre run defer reply",
          interaction: interaction,
          debugs: { ephemeral: button.defaultReplyOptions.ephemeral },
          baseError: anyToError(e),
        }).generateId();
        this.logger.logError(error);

        void this.sendError(interaction, internalErrorEmbed(error.id));
        return;
      }
    }

    try {
      const [result, err] = await button.run({
        interaction: interaction,
        defer: defer,
      });

      if (err) {
        err.generateId();
        this.logger.logError(err);
        void this.sendError(interaction, internalErrorEmbed(err.id), defer);
        return;
      }

      this.logger.info(`${interaction.user.username} used button ${button.name}`
        +  `(${interaction.customId}). Result : `
        + (typeof result === "string" ? result : "success"));
    } catch (e) {
      const error = new ButtonError({
        message: "failed to handle button interaction",
        interaction: interaction,
        baseError: anyToError(e),
      }).generateId();
      this.logger.logError(error);
      void this.sendError(interaction, internalErrorEmbed(error.id), defer);
    }
  }

  async handleSelectMenu(interaction: AnySelectMenuInteraction): Promise<void> {
    const customId = this.getCustomID(interaction);
    const selectMenu = this.selectMenus.get(customId);
    if (!selectMenu) {
      this.logger.warning(`Select menu component ${customId} does not exist/registered`);
      await this.sendError(interaction, internalErrorEmbed());
      return;
    }

    if (selectMenu.authorOnly && interaction.message.interaction) {
      if (selectMenu.authorOnly && interaction.message.interaction) {
        if (interaction.user.id !== interaction.message.interaction.user.id) {
          this.logger.trace(`${interaction.user.username} (${interaction.user.id}) run select menu for `
            + `${interaction.message.interaction.user.id}, ${interaction.user.id} that are author only`);
        }
        await this.sendError(interaction, authorOnly());
        return;
      }
    }

    const defer = selectMenu.defaultReplyOptions.preReply;
    if (defer) {
      try {
        await interaction.deferReply({
          ephemeral: selectMenu.defaultReplyOptions.ephemeral,
        });
      } catch (e) {
        const error = new SelectMenuError({
          message: "failed to pre run defer reply",
          interaction: interaction,
          debugs: { ephemeral: selectMenu.defaultReplyOptions.ephemeral },
          baseError: anyToError(e),
        }).generateId();
        this.logger.logError(error);

        void this.sendError(interaction, internalErrorEmbed(error.id));
        return;
      }
    }

    try {
      const [result, err] = await selectMenu.run({
        interaction: interaction,
        defer: defer,
      });

      if (err) {
        err.generateId();
        this.logger.logError(err);
        await this.sendError(interaction, internalErrorEmbed(err.id), defer);
        return;
      }

      this.logger.info(`${interaction.user.username} used select menu ${selectMenu.name}`
        +  `(${interaction.customId}). Result : `
        + (typeof result === "string" ? result : "success"));
    } catch (e) {
      const error = new SelectMenuError({
        message: "failed to handle button interaction",
        interaction: interaction,
        baseError: anyToError(e),
      }).generateId();
      this.logger.logError(error);
      void this.sendError(interaction, internalErrorEmbed(error.id), defer);
    }

  }

  async handleModalSubmit(interaction: ModalSubmitInteraction): Promise<void> {
    const customId = this.getCustomID(interaction);
    const modalSubmit = this.modalSubmit.get(customId);
    if (!modalSubmit) {
      this.logger.warning(`Modal submit component ${customId} does not exist/registered`);
      await this.sendError(interaction, internalErrorEmbed());
      return;
    }

    const defer = modalSubmit.defaultReplyOptions.preReply;
    if (defer) {
      try {
        await interaction.deferReply({
          ephemeral: modalSubmit.defaultReplyOptions.ephemeral,
        });
      } catch (e) {
        const error = new ModalSubmitError({
          message: "failed to pre run defer reply",
          interaction: interaction,
          debugs: { ephemeral: modalSubmit.defaultReplyOptions.ephemeral },
          baseError: anyToError(e),
        }).generateId();
        this.logger.logError(error);

        void this.sendError(interaction, internalErrorEmbed(error.id));
        return;
      }
    }

    try {
      const [result, err] = await modalSubmit.run({
        interaction: interaction,
        defer: defer,
      });

      if (err) {
        err.generateId();
        this.logger.logError(err);
        void this.sendError(interaction, internalErrorEmbed(err.id), defer);
        return;
      }

      this.logger.info(`${interaction.user.username} used modal submit ${modalSubmit.name}`
        +  `(${interaction.customId}). Result : `
        + (typeof result === "string" ? result : "success"));

    } catch (e) {
      const error = new ModalSubmitError({
        message: "failed to handle modal submit interaction",
        interaction: interaction,
        baseError: anyToError(e),
      }).generateId();

      this.logger.logError(error);
      void this.sendError(interaction, internalErrorEmbed(error.id), defer);
    }
  }

  validCustomID(id: string): true|string {
    if (id.includes(CUSTOM_ID_SEPARATOR)) {
      return `id ${id} include id separator ${CUSTOM_ID_SEPARATOR}`;
    }

    if (id.length > 50) {
      return `id ${id} is too long, it should be less than or equal to 50 characters`;
    }
    return true;
  }

  getCustomID(interaction: MessageComponentInteraction|ModalSubmitInteraction): string {
    return interaction.customId.split(CUSTOM_ID_SEPARATOR)[0];
  }

  async sendError(interaction: MessageComponentInteraction|ModalSubmitInteraction, embed: EmbedBuilder, defer: boolean = false):
    Promise<void> {
    try {
      if (defer) {
        await interaction.editReply({
          embeds: [embed],
        });
      } else {
        await interaction.reply({
          embeds: [embed],
          ephemeral: true,
        });
      }
    } catch (e) {
      this.logger.error("failed to send error message", {
        baseError: anyToError(e).message,
      });
    }
  }

}