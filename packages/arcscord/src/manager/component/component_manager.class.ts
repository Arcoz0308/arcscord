import type { ArcClient, ComponentContext } from "#/base";
import type { ComponentHandler } from "#/base/components/component_handlers.type";
import type { ComponentList } from "#/manager/component/component_manager.type";
import type { Result } from "@arcscord/error";
import type {
  BaseMessageOptions,
  ButtonInteraction,
  ChannelSelectMenuInteraction,
  MentionableSelectMenuInteraction,
  MessageComponentInteraction,
  ModalSubmitInteraction,
  RoleSelectMenuInteraction,
  StringSelectMenuInteraction,
  UserSelectMenuInteraction,
} from "discord.js";
import { ButtonContext } from "#/base/components";
import { ModalContext } from "#/base/components/context/modal_context";
import {
  ChannelSelectMenuContext,
  MentionableSelectMenuContext,
  RoleSelectMenuContext,
  StringSelectMenuContext,
  UserSelectMenuContext,
} from "#/base/components/context/select_menu_context";
import { BaseManager } from "#/base/manager/manager.class";
import { ComponentError, internalErrorEmbed } from "#/utils";
import { BaseError } from "@arcscord/better-error";
import { anyToError, error, ok } from "@arcscord/error";

/**
 * Manages and handles interactive components
 */
export class ComponentManager extends BaseManager {
  name = "components";

  components: ComponentList = {
    button: new Map(),
    stringSelectMenu: new Map(),
    userSelectMenu: new Map(),
    roleSelectMenu: new Map(),
    mentionableSelectMenu: new Map(),
    channelSelectMenu: new Map(),
    modal: new Map(),
  };

  constructor(client: ArcClient) {
    super(client);

    client.on("interactionCreate", (interaction) => {
      if (interaction.isMessageComponent() || interaction.isModalSubmit()) {
        void this.handleInteraction(interaction);
      }
    });
  }

  /**
   * Loads an array of component properties and initializes the components.
   *
   * @param components - components to loads
   */
  loadComponents(components: ComponentHandler[]): void {
    for (const component of components) {
      this.loadComponent(component);
    }
  }

  /**
   * Load a single component
   * @param component - component to load
   */
  loadComponent(component: ComponentHandler): void {
    switch (component.type) {
      case "button":
        this.components.button.set(component.matcher, component);
        this.logger.trace(
          `loaded button with matcher ${component.matcher} with type ${component.matcherType || "begin"}`,
        );
        return;
      case "stringSelect":
        this.components.stringSelectMenu.set(component.matcher, component);
        this.logger.trace(
          `loaded string select menu with matcher ${component.matcher} with type ${component.matcherType || "begin"}`,
        );
        return;
      case "userSelect":
        this.components.userSelectMenu.set(component.matcher, component);
        this.logger.trace(
          `loaded user select menu with matcher ${component.matcher} with type ${component.matcherType || "begin"}`,
        );
        return;
      case "roleSelect":
        this.components.roleSelectMenu.set(component.matcher, component);
        this.logger.trace(
          `loaded role select menu with matcher ${component.matcher} with type ${component.matcherType || "begin"}`,
        );
        return;
      case "mentionableSelect":
        this.components.mentionableSelectMenu.set(component.matcher, component);
        this.logger.trace(
          `loaded mentionable select menu with matcher ${component.matcher} with type ${component.matcherType || "begin"}`,
        );
        return;
      case "channelSelect":
        this.components.channelSelectMenu.set(component.matcher, component);
        this.logger.trace(
          `loaded channel select menu with matcher ${component.matcher} with type ${component.matcherType || "begin"}`,
        );
        return;
      case "modal":
        this.components.modal.set(component.matcher, component);
        this.logger.trace(
          `loaded modal with matcher ${component.matcher} with type ${component.matcherType || "begin"}`,
        );
    }
  }

  /**
   * @internal
   */
  private getComponents<K extends string, V extends ComponentHandler>(
    id: string,
    components: Map<K, V>,
  ): V[] {
    const result: V[] = [];
    for (const [, component] of components.entries()) {
      if (component.matcherType === "full" && id === component.matcher) {
        result.push(component);
      }
      else if (id.startsWith(component.matcher)) {
        result.push(component);
      }
    }
    return result;
  }

  /**
   * @internal
   */
  private async handleInteraction(
    interaction: MessageComponentInteraction | ModalSubmitInteraction,
  ): Promise<void> {
    /* Locale */
    const locale = await this.client.localeManager.detectLanguage({
      interaction,
      user: interaction.user,
      guild: interaction.guild,
      channel: interaction.channel,
    });

    /* Modal submit */
    if (interaction.isModalSubmit()) {
      return this.handleModalInteraction(interaction, locale);
    }

    switch (true) {
      case interaction.isButton(): {
        return this.handleButtonInteraction(interaction, locale);
      }

      case interaction.isStringSelectMenu(): {
        return this.handleStringSelectMenuInteraction(interaction, locale);
      }

      case interaction.isUserSelectMenu(): {
        return this.handleUserSelectMenuInteraction(interaction, locale);
      }

      case interaction.isRoleSelectMenu(): {
        return this.handleRoleSelectMenuInteraction(interaction, locale);
      }

      case interaction.isMentionableSelectMenu(): {
        return this.handleMentionableSelectMenuInteraction(interaction, locale);
      }

      case interaction.isChannelSelectMenu(): {
        return this.handleChannelSelectMenuInteraction(interaction, locale);
      }
    }
  }

  private async handleModalInteraction(
    interaction: ModalSubmitInteraction,
    locale: string,
  ): Promise<void> {
    const modals = this.getComponents(
      interaction.customId,
      this.components.modal,
    );
    if (modals.length === 0) {
      const bError = new BaseError({
        message: `didn't found modal with id ${interaction.customId}`,
        debugs: {
          availableMatcher: this.components.modal.keys(),
        },
      });
      this.logger.logError(bError.generateId());
      return this.sendInternalError(
        interaction,
        internalErrorEmbed(this.client, bError.id),
      );
    }

    if (modals.length > 1) {
      const bError = new BaseError({
        message: `found more that one modal that match with ${interaction.customId}`,
        debugs: {
          matchedModal: modals.map(m => m.matcher),
          availableMatcher: this.components.modal.keys(),
        },
      });
      this.logger.logError(bError.generateId());
      return this.sendInternalError(
        interaction,
        internalErrorEmbed(this.client, bError.id),
      );
    }

    const modal = modals[0];

    const context = new ModalContext(this.client, interaction, { locale });

    if (modal.preReply) {
      const [, err] = await context.deferReply({
        ephemeral: modal.ephemeralPreReply,
      });
      if (err) {
        this.logger.logError(err.generateId());
        return this.sendInternalError(
          interaction,
          internalErrorEmbed(this.client, err.id),
        );
      }
    }

    const [result, err] = await this.runMiddleware(modal, context);
    if (err) {
      this.logger.logError(err.generateId());
      return this.sendInternalError(
        interaction,
        internalErrorEmbed(this.client, err.id),
        context.defer,
      );
    }

    if (!result) {
      return;
    }

    context.additional = result as typeof context.additional;

    try {
      const [result, err] = await modal.run(context);
      if (err) {
        this.logger.logError(err.generateId());
        return this.sendInternalError(
          interaction,
          internalErrorEmbed(this.client, err.id),
          context.defer,
        );
      }

      return this.logger.trace(
        `${interaction.user.username} run modal ${modal.matcher} with success ! Result : ${result}`,
      );
    }
    catch (e) {
      const bError = new ComponentError({
        interaction,
        message: `failed to run component with match ${modal.matcher}`,
        originalError: anyToError(e),
      });
      this.logger.logError(bError.generateId());
      return this.sendInternalError(
        interaction,
        internalErrorEmbed(this.client, bError.id),
        context.defer,
      );
    }
  }

  private async handleButtonInteraction(
    interaction: ButtonInteraction,
    locale: string,
  ): Promise<void> {
    const buttons = this.getComponents(
      interaction.customId,
      this.components.button,
    );
    if (buttons.length === 0) {
      const bError = new BaseError({
        message: `didn't find button with id ${interaction.customId}`,
        debugs: {
          availableMatcher: this.components.button.keys(),
        },
      });
      this.logger.logError(bError.generateId());
      return this.sendInternalError(
        interaction,
        internalErrorEmbed(this.client, bError.id),
      );
    }

    if (buttons.length > 1) {
      const bError = new BaseError({
        message: `found more than one button that matches ${interaction.customId}`,
        debugs: {
          matchedButtons: buttons.map(b => b.matcher),
          availableMatcher: this.components.button.keys(),
        },
      });
      this.logger.logError(bError.generateId());
      return this.sendInternalError(
        interaction,
        internalErrorEmbed(this.client, bError.id),
      );
    }

    const button = buttons[0];

    const context = new ButtonContext(this.client, interaction, { locale });

    if (button.preReply) {
      const [, err] = await context.deferReply({
        ephemeral: button.ephemeralPreReply,
      });
      if (err) {
        this.logger.logError(err.generateId());
        return this.sendInternalError(
          interaction,
          internalErrorEmbed(this.client, err.id),
        );
      }
    }

    const [result, err] = await this.runMiddleware(button, context);
    if (err) {
      this.logger.logError(err.generateId());
      return this.sendInternalError(
        interaction,
        internalErrorEmbed(this.client, err.id),
        context.defer,
      );
    }

    if (!result) {
      return;
    }

    context.additional = result as typeof context.additional;

    try {
      const [result, err] = await button.run(context);
      if (err) {
        this.logger.logError(err.generateId());
        return this.sendInternalError(
          interaction,
          internalErrorEmbed(this.client, err.id),
          context.defer,
        );
      }

      return this.logger.trace(
        `${interaction.user.username} run button ${button.matcher} with success! Result: ${result}`,
      );
    }
    catch (e) {
      const bError = new ComponentError({
        interaction,
        message: `failed to run button with match ${button.matcher}`,
        originalError: anyToError(e),
      });
      this.logger.logError(bError.generateId());
      return this.sendInternalError(
        interaction,
        internalErrorEmbed(this.client, bError.id),
        context.defer,
      );
    }
  }

  private async handleStringSelectMenuInteraction(
    interaction: StringSelectMenuInteraction,
    locale: string,
  ): Promise<void> {
    const stringSelectMenus = this.getComponents(
      interaction.customId,
      this.components.stringSelectMenu,
    );
    if (stringSelectMenus.length === 0) {
      const bError = new BaseError({
        message: `didn't find string select menu with id ${interaction.customId}`,
        debugs: {
          availableMatcher: this.components.stringSelectMenu.keys(),
        },
      });
      this.logger.logError(bError.generateId());
      return this.sendInternalError(
        interaction,
        internalErrorEmbed(this.client, bError.id),
      );
    }

    if (stringSelectMenus.length > 1) {
      const bError = new BaseError({
        message: `found more than one string select menu that matches ${interaction.customId}`,
        debugs: {
          matchedMenus: stringSelectMenus.map(m => m.matcher),
          availableMatcher: this.components.stringSelectMenu.keys(),
        },
      });
      this.logger.logError(bError.generateId());
      return this.sendInternalError(
        interaction,
        internalErrorEmbed(this.client, bError.id),
      );
    }

    const stringSelectMenu = stringSelectMenus[0];

    const context = new StringSelectMenuContext(this.client, interaction, {
      values: interaction.values,
      locale,
    });

    if (stringSelectMenu.preReply) {
      const [, err] = await context.deferReply({
        ephemeral: stringSelectMenu.ephemeralPreReply,
      });
      if (err) {
        this.logger.logError(err.generateId());
        return this.sendInternalError(
          interaction,
          internalErrorEmbed(this.client, err.id),
        );
      }
    }

    const [result, err] = await this.runMiddleware(stringSelectMenu, context);
    if (err) {
      this.logger.logError(err.generateId());
      return this.sendInternalError(
        interaction,
        internalErrorEmbed(this.client, err.id),
        context.defer,
      );
    }

    if (!result) {
      return;
    }

    context.additional = result as typeof context.additional;

    try {
      const [result, err] = await stringSelectMenu.run(context);
      if (err) {
        this.logger.logError(err.generateId());
        return this.sendInternalError(
          interaction,
          internalErrorEmbed(this.client, err.id),
          context.defer,
        );
      }

      return this.logger.trace(
        `${interaction.user.username} run string select menu ${stringSelectMenu.matcher} with success! Result: ${result}`,
      );
    }
    catch (e) {
      const bError = new ComponentError({
        interaction,
        message: `failed to run string select menu with match ${stringSelectMenu.matcher}`,
        originalError: anyToError(e),
      });
      this.logger.logError(bError.generateId());
      return this.sendInternalError(
        interaction,
        internalErrorEmbed(this.client, bError.id),
        context.defer,
      );
    }
  }

  private async handleUserSelectMenuInteraction(
    interaction: UserSelectMenuInteraction,
    locale: string,
  ): Promise<void> {
    const userSelectMenus = this.getComponents(
      interaction.customId,
      this.components.userSelectMenu,
    );
    if (userSelectMenus.length === 0) {
      const bError = new BaseError({
        message: `didn't find user select menu with id ${interaction.customId}`,
        debugs: {
          availableMatcher: this.components.userSelectMenu.keys(),
        },
      });
      this.logger.logError(bError.generateId());
      return this.sendInternalError(
        interaction,
        internalErrorEmbed(this.client, bError.id),
      );
    }

    if (userSelectMenus.length > 1) {
      const bError = new BaseError({
        message: `found more than one user select menu that matches ${interaction.customId}`,
        debugs: {
          matchedMenus: userSelectMenus.map(m => m.matcher),
          availableMatcher: this.components.userSelectMenu.keys(),
        },
      });
      this.logger.logError(bError.generateId());
      return this.sendInternalError(
        interaction,
        internalErrorEmbed(this.client, bError.id),
      );
    }

    const userSelectMenu = userSelectMenus[0];

    const context = new UserSelectMenuContext(this.client, interaction, {
      values: interaction.users.map(u => u),
      locale,
    });

    if (userSelectMenu.preReply) {
      const [, err] = await context.deferReply({
        ephemeral: userSelectMenu.ephemeralPreReply,
      });
      if (err) {
        this.logger.logError(err.generateId());
        return this.sendInternalError(
          interaction,
          internalErrorEmbed(this.client, err.id),
        );
      }
    }

    const [result, err] = await this.runMiddleware(userSelectMenu, context);
    if (err) {
      this.logger.logError(err.generateId());
      return this.sendInternalError(
        interaction,
        internalErrorEmbed(this.client, err.id),
        context.defer,
      );
    }

    if (!result) {
      return;
    }

    context.additional = result as typeof context.additional;

    try {
      const [result, err] = await userSelectMenu.run(context);
      if (err) {
        this.logger.logError(err.generateId());
        return this.sendInternalError(
          interaction,
          internalErrorEmbed(this.client, err.id),
          context.defer,
        );
      }

      return this.logger.trace(
        `${interaction.user.username} run user select menu ${userSelectMenu.matcher} with success! Result: ${result}`,
      );
    }
    catch (e) {
      const bError = new ComponentError({
        interaction,
        message: `failed to run user select menu with match ${userSelectMenu.matcher}`,
        originalError: anyToError(e),
      });
      this.logger.logError(bError.generateId());
      return this.sendInternalError(
        interaction,
        internalErrorEmbed(this.client, bError.id),
        context.defer,
      );
    }
  }

  private async handleRoleSelectMenuInteraction(
    interaction: RoleSelectMenuInteraction,
    locale: string,
  ): Promise<void> {
    const roleSelectMenus = this.getComponents(
      interaction.customId,
      this.components.roleSelectMenu,
    );
    if (roleSelectMenus.length === 0) {
      const bError = new BaseError({
        message: `didn't find role select menu with id ${interaction.customId}`,
        debugs: {
          availableMatcher: this.components.roleSelectMenu.keys(),
        },
      });
      this.logger.logError(bError.generateId());
      return this.sendInternalError(
        interaction,
        internalErrorEmbed(this.client, bError.id),
      );
    }

    if (roleSelectMenus.length > 1) {
      const bError = new BaseError({
        message: `found more than one role select menu that matches ${interaction.customId}`,
        debugs: {
          matchedMenus: roleSelectMenus.map(m => m.matcher),
          availableMatcher: this.components.roleSelectMenu.keys(),
        },
      });
      this.logger.logError(bError.generateId());
      return this.sendInternalError(
        interaction,
        internalErrorEmbed(this.client, bError.id),
      );
    }

    const roleSelectMenu = roleSelectMenus[0];

    const context = new RoleSelectMenuContext(this.client, interaction, {
      values: interaction.roles.map(r => r),
      locale,
    });

    if (roleSelectMenu.preReply) {
      const [, err] = await context.deferReply({
        ephemeral: roleSelectMenu.ephemeralPreReply,
      });
      if (err) {
        this.logger.logError(err.generateId());
        return this.sendInternalError(
          interaction,
          internalErrorEmbed(this.client, err.id),
        );
      }
    }

    const [result, err] = await this.runMiddleware(roleSelectMenu, context);
    if (err) {
      this.logger.logError(err.generateId());
      return this.sendInternalError(
        interaction,
        internalErrorEmbed(this.client, err.id),
        context.defer,
      );
    }

    if (!result) {
      return;
    }

    context.additional = result as typeof context.additional;

    try {
      const [result, err] = await roleSelectMenu.run(context);
      if (err) {
        this.logger.logError(err.generateId());
        return this.sendInternalError(
          interaction,
          internalErrorEmbed(this.client, err.id),
          context.defer,
        );
      }

      return this.logger.trace(
        `${interaction.user.username} run role select menu ${roleSelectMenu.matcher} with success! Result: ${result}`,
      );
    }
    catch (e) {
      const bError = new ComponentError({
        interaction,
        message: `failed to run role select menu with match ${roleSelectMenu.matcher}`,
        originalError: anyToError(e),
      });
      this.logger.logError(bError.generateId());
      return this.sendInternalError(
        interaction,
        internalErrorEmbed(this.client, bError.id),
        context.defer,
      );
    }
  }

  private async handleMentionableSelectMenuInteraction(
    interaction: MentionableSelectMenuInteraction,
    locale: string,
  ): Promise<void> {
    const mentionableSelectMenus = this.getComponents(
      interaction.customId,
      this.components.mentionableSelectMenu,
    );
    if (mentionableSelectMenus.length === 0) {
      const bError = new BaseError({
        message: `didn't find mentionable select menu with id ${interaction.customId}`,
        debugs: {
          availableMatcher: this.components.mentionableSelectMenu.keys(),
        },
      });
      this.logger.logError(bError.generateId());
      return this.sendInternalError(
        interaction,
        internalErrorEmbed(this.client, bError.id),
      );
    }

    if (mentionableSelectMenus.length > 1) {
      const bError = new BaseError({
        message: `found more than one mentionable select menu that matches ${interaction.customId}`,
        debugs: {
          matchedMenus: mentionableSelectMenus.map(m => m.matcher),
          availableMatcher: this.components.mentionableSelectMenu.keys(),
        },
      });
      this.logger.logError(bError.generateId());
      return this.sendInternalError(
        interaction,
        internalErrorEmbed(this.client, bError.id),
      );
    }

    const mentionableSelectMenu = mentionableSelectMenus[0];

    const context = new MentionableSelectMenuContext(this.client, interaction, {
      roles: interaction.roles.map(r => r),
      users: interaction.users.map(u => u),
      locale,
    });

    if (mentionableSelectMenu.preReply) {
      const [, err] = await context.deferReply({
        ephemeral: mentionableSelectMenu.ephemeralPreReply,
      });
      if (err) {
        this.logger.logError(err.generateId());
        return this.sendInternalError(
          interaction,
          internalErrorEmbed(this.client, err.id),
        );
      }
    }

    const [result, err] = await this.runMiddleware(mentionableSelectMenu, context);
    if (err) {
      this.logger.logError(err.generateId());
      return this.sendInternalError(
        interaction,
        internalErrorEmbed(this.client, err.id),
        context.defer,
      );
    }

    if (!result) {
      return;
    }

    context.additional = result as typeof context.additional;

    try {
      const [result, err] = await mentionableSelectMenu.run(context);
      if (err) {
        this.logger.logError(err.generateId());
        return this.sendInternalError(
          interaction,
          internalErrorEmbed(this.client, err.id),
          context.defer,
        );
      }

      return this.logger.trace(
        `${interaction.user.username} run mentionable select menu `
        + `${mentionableSelectMenu.matcher} with success! Result: ${result}`,
      );
    }
    catch (e) {
      const bError = new ComponentError({
        interaction,
        message: `failed to run mentionable select menu with match ${mentionableSelectMenu.matcher}`,
        originalError: anyToError(e),
      });
      this.logger.logError(bError.generateId());
      return this.sendInternalError(
        interaction,
        internalErrorEmbed(this.client, bError.id),
        context.defer,
      );
    }
  }

  private async handleChannelSelectMenuInteraction(
    interaction: ChannelSelectMenuInteraction,
    locale: string,
  ): Promise<void> {
    const channelSelectMenus = this.getComponents(
      interaction.customId,
      this.components.channelSelectMenu,
    );
    if (channelSelectMenus.length === 0) {
      const bError = new BaseError({
        message: `didn't find channel select menu with id ${interaction.customId}`,
        debugs: {
          availableMatcher: this.components.channelSelectMenu.keys(),
        },
      });
      this.logger.logError(bError.generateId());
      return this.sendInternalError(
        interaction,
        internalErrorEmbed(this.client, bError.id),
      );
    }

    if (channelSelectMenus.length > 1) {
      const bError = new BaseError({
        message: `found more than one channel select menu that matches ${interaction.customId}`,
        debugs: {
          matchedMenus: channelSelectMenus.map(m => m.matcher),
          availableMatcher: this.components.channelSelectMenu.keys(),
        },
      });
      this.logger.logError(bError.generateId());
      return this.sendInternalError(
        interaction,
        internalErrorEmbed(this.client, bError.id),
      );
    }

    const channelSelectMenu = channelSelectMenus[0];

    const context = new ChannelSelectMenuContext(this.client, interaction, {
      values: interaction.channels.map(c => c),
      locale,
    });

    if (channelSelectMenu.preReply) {
      const [, err] = await context.deferReply({
        ephemeral: channelSelectMenu.ephemeralPreReply,
      });
      if (err) {
        this.logger.logError(err.generateId());
        return this.sendInternalError(
          interaction,
          internalErrorEmbed(this.client, err.id),
        );
      }
    }

    const [result, err] = await this.runMiddleware(channelSelectMenu, context);
    if (err) {
      this.logger.logError(err.generateId());
      return this.sendInternalError(
        interaction,
        internalErrorEmbed(this.client, err.id),
        context.defer,
      );
    }

    if (!result) {
      return;
    }

    context.additional = result as typeof context.additional;

    try {
      const [result, err] = await channelSelectMenu.run(context);
      if (err) {
        this.logger.logError(err.generateId());
        return this.sendInternalError(
          interaction,
          internalErrorEmbed(this.client, err.id),
          context.defer,
        );
      }

      return this.logger.trace(
        `${interaction.user.username} run channel select menu ${channelSelectMenu.matcher} with success! Result: ${result}`,
      );
    }
    catch (e) {
      const bError = new ComponentError({
        interaction,
        message: `failed to run channel select menu with match ${channelSelectMenu.matcher}`,
        originalError: anyToError(e),
      });
      this.logger.logError(bError.generateId());
      return this.sendInternalError(
        interaction,
        internalErrorEmbed(this.client, bError.id),
        context.defer,
      );
    }
  }

  private async runMiddleware(props: ComponentHandler, context: ComponentContext): Promise<Result<object | false, ComponentError>> {
    const additional: Record<string, Record<string, unknown>> = {};
    if (!props.use || props.use.length === 0) {
      return ok({});
    }
    for (const middleware of props.use) {
      try {
        const result = await middleware.run(context);
        if (result.cancel) {
          const [, err] = await result.cancel;
          if (err) {
            return error(err);
          }
          return ok(false);
        }
        additional[middleware.name] = result.next;
      }
      catch (e) {
        return error(new ComponentError({
          message: `Failed to run middleware : ${anyToError(e).message}`,
          interaction: context.interaction,
          originalError: anyToError(e),
        }));
      }
    }
    return ok(additional);
  };

  /**
   * Send a internal error
   */
  async sendInternalError(
    interaction: MessageComponentInteraction | ModalSubmitInteraction,
    message: BaseMessageOptions,
    defer: boolean = false,
  ): Promise<void> {
    try {
      if (defer) {
        await interaction.editReply(message);
      }
      else {
        await interaction.reply({
          ...message,
          ephemeral: true,
        });
      }
    }
    catch (e) {
      this.logger.error("failed to send error message", {
        baseError: anyToError(e).message,
      });
    }
  }
}
