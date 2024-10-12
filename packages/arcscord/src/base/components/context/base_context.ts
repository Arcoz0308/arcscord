import type { ArcClient } from "#/base";
import type { ComponentRunResult } from "#/base/components";
import type { ContextDocs } from "#/base/utils";
import type {
  Guild,
  GuildBasedChannel,
  GuildMember,
  InteractionDeferReplyOptions,
  InteractionEditReplyOptions,
  InteractionReplyOptions,
  MessageComponentInteraction,
  MessagePayload,
  ModalSubmitInteraction,
  User,
} from "discord.js";
import { ComponentError, type ComponentErrorOptions } from "#/utils";
import { anyToError, error, ok } from "@arcscord/error";

/**
 * Base Component context
 */
export class ComponentContext implements Omit<ContextDocs, "command" | "resolvedCommandName"> {
  /**
   * The custom id of the component
   */
  customId: string;

  interaction: MessageComponentInteraction | ModalSubmitInteraction;

  user: User;

  /**
   * If interaction already deferred
   */
  defer: boolean = false;

  client: ArcClient;

  /**
   * Constructor for ComponentContext.
   * @param client The ArcClient instance.
   * @param interaction The interaction object.
   */
  constructor(
    client: ArcClient,
    interaction: MessageComponentInteraction | ModalSubmitInteraction,
  ) {
    this.customId = interaction.customId;
    this.user = interaction.user;

    this.interaction = interaction;

    this.client = client;
  }

  /**
   * Responds to the interaction by sending a reply message.
   * @param message The reply message or options.
   * @param options Optional additional reply options.
   * @returns The result of the reply operation.
   */
  async reply(
    message: string,
    options?: Omit<InteractionReplyOptions, "content">
  ): Promise<ComponentRunResult>;

  /**
   * Responds to the interaction by sending a reply message.
   * @param options Reply options.
   * @returns The result of the reply operation.
   */
  async reply(
    options: MessagePayload | InteractionReplyOptions
  ): Promise<ComponentRunResult>;

  async reply(
    message: string | MessagePayload | InteractionReplyOptions,
    options?: Omit<InteractionReplyOptions, "content">,
  ): Promise<ComponentRunResult> {
    try {
      if (options && typeof message === "string") {
        message = { ...options, content: message };
      }

      await this.interaction.reply(message);
      return ok(true);
    }
    catch (e) {
      return error(
        new ComponentError({
          interaction: this.interaction,
          message: `failed to reply to interaction : ${anyToError(e).message}`,
          originalError: anyToError(e),
        }),
      );
    }
  }

  /**
   * Edits an existing reply message in the interaction.
   * @param message The new message content or options.
   * @param options Optional additional edit reply options.
   * @returns The result of the edit operation.
   */
  async editReply(
    message: string,
    options?: Omit<InteractionEditReplyOptions, "content">
  ): Promise<ComponentRunResult>;

  /**
   * Edits an existing reply message in the interaction.
   * @param options Edit reply options.
   * @returns The result of the edit operation.
   */
  async editReply(
    options: MessagePayload | InteractionEditReplyOptions
  ): Promise<ComponentRunResult>;

  async editReply(
    message: string | MessagePayload | InteractionEditReplyOptions,
    options?: Omit<InteractionReplyOptions, "content">,
  ): Promise<ComponentRunResult> {
    try {
      if (options && typeof message === "string") {
        message = { ...options, content: message };
      }

      await this.interaction.editReply(message);
      return ok(true);
    }
    catch (e) {
      return error(
        new ComponentError({
          interaction: this.interaction,
          message: `failed to edit reply to interaction : ${anyToError(e).message}`,
          originalError: anyToError(e),
        }),
      );
    }
  }

  /**
   * Defers the reply to the interaction.
   * @param options The defer reply options.
   * @returns The result of the defer operation.
   */
  async deferReply(
    options: InteractionDeferReplyOptions,
  ): Promise<ComponentRunResult> {
    try {
      await this.interaction.deferReply(options);
      this.defer = true;
      return ok(true);
    }
    catch (e) {
      return error(
        new ComponentError({
          interaction: this.interaction,
          message: `failed to defer reply to interaction : ${anyToError(e).message}}`,
          originalError: anyToError(e),
        }),
      );
    }
  }

  /**
   * Wraps a value with a success status.
   * @param value The value to be wrapped.
   * @returns The result object with success status.
   */
  ok(value: string | true = true): ComponentRunResult {
    return ok(value);
  }

  /**
   * Creates an error result.
   * @param options The error options.
   * @returns The error result.
   */
  error(
    options: Omit<ComponentErrorOptions, "interaction">,
  ): ComponentRunResult {
    return error(
      new ComponentError({ ...options, interaction: this.interaction }),
    );
  }

  /**
   * Runs multiple functions sequentially and stops on the first error.
   * @param funcList The list of functions to run.
   * @returns The result of the multiple operations.
   */
  async multiple(
    ...funcList: Promise<ComponentRunResult>[]
  ): Promise<ComponentRunResult> {
    for (const func of funcList) {
      const [, err] = await func;

      if (err) {
        return error(err);
      }
    }

    return ok(true);
  }
}

/**
 * GuildComponentContextOptions type declaration.
 */
export type GuildComponentContextOptions = {
  member: GuildMember;
  guild: Guild;
  channel: GuildBasedChannel;
};
