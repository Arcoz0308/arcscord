import type { ArcClient, ComponentContext } from "#/base";
import type { ComponentHandler, ModalComponentHandler } from "#/base/components/component_handlers.type";
import type { ComponentErrorHandlerInfos, ComponentList, ComponentManagerOptions, ComponentResultHandlerInfos } from "#/manager/component/component_manager.type";
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
import { anyToError, error, ok, type Result } from "@arcscord/error";
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

  options: Required<ComponentManagerOptions>;

  constructor(client: ArcClient, options?: ComponentManagerOptions) {
    super(client);

    this.options = {
      resultHandler: this.handleResult.bind(this),
      errorHandler: this.handleError.bind(this),
      ...options,
    };
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
   * @returns the number of components loaded
   */
  loadComponents(components: ComponentHandler[]): number {
    for (const component of components) {
      this.loadComponent(component);
    }
    return components.length;
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

  private createContext(interaction: MessageComponentInteraction | ModalSubmitInteraction, type: ComponentType, locale: string): Result<ComponentContext, ComponentError> {
    switch (type) {
      case ComponentType.Button:
        return ok(new ButtonContext(this.client, interaction as ButtonInteraction, { locale }));
      case ComponentType.StringSelect:
        return ok(new StringSelectMenuContext(this.client, interaction as StringSelectMenuInteraction, {
          locale,
          values: (interaction as StringSelectMenuInteraction).values,
        }));
      case ComponentType.UserSelect:
        return ok(new UserSelectMenuContext(this.client, interaction as UserSelectMenuInteraction, {
          locale,
          values: (interaction as UserSelectMenuInteraction).users.map(u => u),
        }));
      case ComponentType.RoleSelect:
        return ok(new RoleSelectMenuContext(this.client, interaction as RoleSelectMenuInteraction, {
          locale,
          values: (interaction as RoleSelectMenuInteraction).roles.map(r => r),
        }));
      case ComponentType.MentionableSelect:
        return ok(new MentionableSelectMenuContext(this.client, interaction as MentionableSelectMenuInteraction, {
          locale,
          users: (interaction as MentionableSelectMenuInteraction).users.map(u => u),
          roles: (interaction as MentionableSelectMenuInteraction).roles.map(r => r),
        }));
      case ComponentType.ChannelSelect:
        return ok(new ChannelSelectMenuContext(this.client, interaction as ChannelSelectMenuInteraction, {
          locale,
          values: (interaction as ChannelSelectMenuInteraction).channels.map(c => c),
        }));
      case ComponentType.TextInput:
        return ok(new ModalContext(this.client, interaction as ModalSubmitInteraction, { locale }));
      default:
        return error(new ComponentError({
          message: `Unknown component type: ${type}`,
          interaction,
        }));
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

    const [components, err] = this.findMatchingComponents(interaction, type);
    if (err) {
      return this.options.errorHandler({
        error: err,
        component: undefined,
        context: undefined,
        internal: true,
        interaction,
      });
    }

    if (components.length < 1) {
      return this.options.errorHandler({
        interaction,
        error: new BaseError(`No found components with custom id match with ${interaction.customId}`),
        internal: false,
      });
    }

    if (components.length > 1) {
      return this.options.errorHandler({
        interaction,
        internal: false,
        error: new BaseError(`Find multiple match with custom id ${interaction.customId}`),
      });
    }

    const [context, err2] = this.createContext(interaction, type, locale);
    if (err2) {
      return this.options.errorHandler({
        error: err2,
        internal: true,
      });
    }

    const component = components[0];

    const [, err3] = await this.handlePreReply(component, context);
    if (err3) {
      return this.options.errorHandler({
        error: err3,
        component,
        context,
        internal: true,
      });
    }

    const [middlewareResult, err4] = await this.runMiddleware(component, context);
    if (err4) {
      return this.options.errorHandler({
        error: err4,
        component,
        context,
        internal: false,
      });
    }
    if (!this.handleMiddlewareResult(middlewareResult, context)) {
      return;
    }

    await this.executeComponent(component, context);
  }

  private findMatchingComponents(
    interaction: MessageComponentInteraction | ModalSubmitInteraction,
    type: Exclude<ComponentType, ComponentType.ActionRow>,
  ): Result<ComponentHandler[], ComponentError> {
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
      return error(new ComponentError({
        message: `didn't found component with id ${interaction.customId}`,
        interaction,
        debugs: {
          availableMatcher: componentsList.keys(),
          type,
        },
      }));
    }

    if (components.length > 1) {
      return error(new ComponentError({
        message: `found more than one component that matches with ${interaction.customId}`,
        interaction,
      }));
    }

    return ok(components);
  }

  private async handlePreReply(component: ComponentHandler, context: ComponentContext): Promise<Result<true, ComponentError>> {
    if (component.preReply) {
      const [, err] = await context.deferReply({
        ephemeral: component.ephemeralPreReply,
      });
      if (err) {
        return error(new ComponentError({
          message: "Failed to defer reply",
          interaction: context.interaction,
          originalError: err,
        }));
      }
    }
    return ok(true);
  }

  private handleMiddlewareResult(middlewareResult: object | false, context: ComponentContext): boolean {
    if (!middlewareResult) {
      return false;
    }

    context.additional = middlewareResult as typeof context.additional;
    return true;
  }

  private async executeComponent(component: ComponentHandler, context: ComponentContext): Promise<void> {
    const start = Date.now();
    try {
      // @ts-expect-error fix error with others context types
      const result = await component.run(context);
      return this.options.resultHandler({
        result,
        component,
        interaction: context.interaction,
        defer: context.defer,
        start,
        end: Date.now(),
      });
    }
    catch (e) {
      const bError = new ComponentError({
        interaction: context.interaction,
        message: `failed to run component with match ${component.matcher}`,
        originalError: anyToError(e),
      });
      return this.options.resultHandler({
        result: error(bError),
        component,
        interaction: context.interaction,
        defer: context.defer,
        start,
        end: Date.now(),
      });
    }
  }

  private async runMiddleware(props: ComponentHandler, context: ComponentContext): Promise<Result<object | false, ComponentError>> {
    const additional: Record<string, Record<string, unknown>> = {};
    if (!props.use || props.use.length === 0) {
      return ok({});
    }
    for (const middleware of props.use) {
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
    return ok(additional);
  }

  async sendInternalError(
    interaction: MessageComponentInteraction | ModalSubmitInteraction,
    message: BaseMessageOptions,
    defer: boolean = false,
  ): Promise<void> {
    const replyResult = defer
      ? await interaction.editReply(message).then(ok).catch(error)
      : await interaction.reply({
        ...message,
        ephemeral: true,
      }).then(ok).catch(error);

    if (!replyResult[0]) {
      this.logger.error("failed to send error message", {
        baseError: replyResult[1].message,
      });
    }
  }

  async handleResult(infos: ComponentResultHandlerInfos): Promise<void> {
    const [result, err] = infos.result;
    if (err !== null) {
      err.generateId();
      this.logger.logError(err);
      return this.sendInternalError(
        infos.interaction,
        internalErrorEmbed(this.client, err.id),
        infos.defer,
      );
    }

    this.logger.info(
      `${infos.interaction.user.username} used component ${infos.component.matcher}. Result : ${
        typeof result === "string" ? result : "success"
      }`,
    );
  }

  async handleError(infos: ComponentErrorHandlerInfos): Promise<void> {
    this.logger.logError(infos.error.generateId());

    if (!infos.interaction) {
      return;
    }

    if (!infos.internal) {
      return this.sendInternalError(
        infos.interaction,
        internalErrorEmbed(this.client, infos.error.generateId().id),
        infos.context?.defer,
      );
    }
  }
}
