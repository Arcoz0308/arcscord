import type { ArcClient, ComponentContext } from "#/base";
import type { ComponentHandler, ModalComponentHandler } from "#/base/components/component_handlers.type";
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
import { ComponentType } from "discord-api-types/v10";

/**
 * Manages and handles interactive components
 */
export class ComponentManager extends BaseManager {
  name = "components";

  components: ComponentList = {
    [ComponentType.Button]: new Map(),
    [ComponentType.StringSelect]: new Map(),
    [ComponentType.UserSelect]: new Map(),
    [ComponentType.RoleSelect]: new Map(),
    [ComponentType.MentionableSelect]: new Map(),
    [ComponentType.ChannelSelect]: new Map(),
    [ComponentType.TextInput]: new Map<string, ModalComponentHandler>(),
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
    // @ts-expect-error fix error with others context types
    this.components[component.type].set(component.matcher, component);

    this.trace(
      `loaded ${component.type} with matcher ${component.matcher} with type ${component.matcherType || "begin"}`,
    );
  }

  /**
   * @internal
   */
  private async handleInteraction(
    interaction: MessageComponentInteraction | ModalSubmitInteraction,
  ): Promise<void> {
    /* Modal submit */
    if (interaction.isModalSubmit()) {
      return this.handleComponentInteraction(interaction, ComponentType.TextInput);
    }

    switch (true) {
      case interaction.isButton(): {
        return this.handleComponentInteraction(interaction, ComponentType.Button);
      }

      case interaction.isStringSelectMenu(): {
        return this.handleComponentInteraction(interaction, ComponentType.StringSelect);
      }

      case interaction.isUserSelectMenu(): {
        return this.handleComponentInteraction(interaction, ComponentType.UserSelect);
      }

      case interaction.isRoleSelectMenu(): {
        return this.handleComponentInteraction(interaction, ComponentType.RoleSelect);
      }

      case interaction.isMentionableSelectMenu(): {
        return this.handleComponentInteraction(interaction, ComponentType.MentionableSelect);
      }

      case interaction.isChannelSelectMenu(): {
        return this.handleComponentInteraction(interaction, ComponentType.ChannelSelect);
      }
    }
  }

  private createContext(interaction: MessageComponentInteraction | ModalSubmitInteraction, type: ComponentType, locale: string): ComponentContext {
    switch (type) {
      case ComponentType.Button:
        return new ButtonContext(this.client, interaction as ButtonInteraction, { locale });
      case ComponentType.StringSelect:
        return new StringSelectMenuContext(this.client, interaction as StringSelectMenuInteraction, {
          locale,
          values: (interaction as StringSelectMenuInteraction).values,
        });
      case ComponentType.UserSelect:
        return new UserSelectMenuContext(this.client, interaction as UserSelectMenuInteraction, {
          locale,
          values: (interaction as UserSelectMenuInteraction).users.map(u => u),
        });
      case ComponentType.RoleSelect:
        return new RoleSelectMenuContext(this.client, interaction as RoleSelectMenuInteraction, {
          locale,
          values: (interaction as RoleSelectMenuInteraction).roles.map(r => r),
        });
      case ComponentType.MentionableSelect:
        return new MentionableSelectMenuContext(this.client, interaction as MentionableSelectMenuInteraction, {
          locale,
          users: (interaction as MentionableSelectMenuInteraction).users.map(u => u),
          roles: (interaction as MentionableSelectMenuInteraction).roles.map(r => r),
        });
      case ComponentType.ChannelSelect:
        return new ChannelSelectMenuContext(this.client, interaction as ChannelSelectMenuInteraction, {
          locale,
          values: (interaction as ChannelSelectMenuInteraction).channels.map(c => c),
        });
      case ComponentType.TextInput:
        return new ModalContext(this.client, interaction as ModalSubmitInteraction, { locale });
      default:
        throw new Error(`Unknown component type: ${type}`);
    }
  }

  private async handleComponentInteraction(
    interaction: MessageComponentInteraction | ModalSubmitInteraction,
    type: Exclude<ComponentType, ComponentType.ActionRow>,
  ): Promise<void> {
    const locale = await this.client.localeManager.detectLanguage({
      interaction,
      user: interaction.user,
      guild: interaction.guild,
      channel: interaction.channel,
    });

    const components = this.findMatchingComponents(interaction, type);
    if (!components)
      return;

    const context = this.createContext(interaction, type, locale);
    const component = components[0];

    if (await this.handlePreReply(component, context))
      return;

    const middlewareResult = await this.runMiddleware(component, context);
    if (!this.handleMiddlewareResult(middlewareResult, context))
      return;

    await this.executeComponent(component, context);
  }

  private findMatchingComponents(
    interaction: MessageComponentInteraction | ModalSubmitInteraction,
    type: Exclude<ComponentType, ComponentType.ActionRow>,
  ): ComponentHandler[] | null {
    const components: ComponentHandler[] = [];
    const componentsList = this.components[type];

    for (const [, component] of componentsList.entries()) {
      if (component.matcherType === "full" && interaction.customId === component.matcher) {
        components.push(component);
      }
      else if (interaction.customId.startsWith(component.matcher)) {
        components.push(component);
      }
    }

    if (components.length === 0) {
      const bError = new BaseError({
        message: `didn't found component with id ${interaction.customId}`,
        debugs: {
          availableMatcher: componentsList.keys(),
          type,
        },
      });
      this.logger.logError(bError.generateId());
      this.sendInternalError(
        interaction,
        internalErrorEmbed(this.client, bError.id),
      );
      return null;
    }

    if (components.length > 1) {
      const bError = new BaseError({
        message: `found more than one component that matches with ${interaction.customId}`,
      });
      this.logger.logError(bError.generateId());
      this.sendInternalError(
        interaction,
        internalErrorEmbed(this.client, bError.id),
      );
      return null;
    }

    return components;
  }

  private async handlePreReply(component: ComponentHandler, context: ComponentContext): Promise<boolean> {
    if (component.preReply) {
      const [, err] = await context.deferReply({
        ephemeral: component.ephemeralPreReply,
      });
      if (err) {
        this.logger.logError(err.generateId());
        await this.sendInternalError(
          context.interaction,
          internalErrorEmbed(this.client, err.id),
        );
        return true;
      }
    }
    return false;
  }

  private handleMiddlewareResult(middlewareResult: Result<object | false, ComponentError>, context: ComponentContext): boolean {
    const [result, err] = middlewareResult;
    if (err) {
      this.logger.logError(err.generateId());
      this.sendInternalError(
        context.interaction,
        internalErrorEmbed(this.client, err.id),
        context.defer,
      );
      return false;
    }

    if (!result) {
      return false;
    }

    context.additional = result as typeof context.additional;
    return true;
  }

  private async executeComponent(component: ComponentHandler, context: ComponentContext): Promise<void> {
    try {
      // @ts-expect-error fix error with others context types
      const [result, err] = await component.run(context);
      if (err) {
        this.logger.logError(err.generateId());
        return this.sendInternalError(
          context.interaction,
          internalErrorEmbed(this.client, err.id),
          context.defer,
        );
      }

      return this.trace(
        `${context.interaction.user.username} run component ${component.matcher} with success! Result: ${result}`,
      );
    }
    catch (e) {
      const bError = new ComponentError({
        interaction: context.interaction,
        message: `failed to run component with match ${component.matcher}`,
        originalError: anyToError(e),
      });
      this.logger.logError(bError.generateId());
      return this.sendInternalError(
        context.interaction,
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
