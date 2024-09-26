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
  User
} from "discord.js";
import type { ArcClient } from "#/base";
import type { ComponentRunResult } from "#/base/components";
import { ComponentError, type ComponentErrorOptions } from "#/utils";
import { anyToError, error, ok } from "@arcscord/error";

export class ComponentContext {

  customId: string;

  interaction: MessageComponentInteraction | ModalSubmitInteraction;

  user: User;

  defer: boolean = false;

  client: ArcClient;

  constructor(client: ArcClient, interaction: MessageComponentInteraction | ModalSubmitInteraction) {
    this.customId = interaction.customId;
    this.user = interaction.user;

    this.interaction = interaction;

    this.client = client;
  }

  async reply(message: string, options?: Omit<InteractionReplyOptions, "content">): Promise<ComponentRunResult>;

  async reply(options: MessagePayload | InteractionReplyOptions): Promise<ComponentRunResult>;

  async reply(message: string | MessagePayload | InteractionReplyOptions, options?: Omit<InteractionReplyOptions, "content">):
    Promise<ComponentRunResult> {
    try {

      if (options && typeof message === "string") {
        message = { ...options, content: message };
      }

      await this.interaction.reply(message);
      return ok(true);
    } catch (e) {
      return error(new ComponentError({
        interaction: this.interaction,
        message: `failed to reply to interaction : ${anyToError(e).message}`,
        originalError: anyToError(e),
      }));
    }
  }

  async editReply(message: string, options?: Omit<InteractionEditReplyOptions, "content">): Promise<ComponentRunResult>;

  async editReply(options: MessagePayload | InteractionEditReplyOptions): Promise<ComponentRunResult>;

  async editReply(message: string | MessagePayload | InteractionEditReplyOptions, options?: Omit<InteractionReplyOptions, "content">):
    Promise<ComponentRunResult> {
    try {

      if (options && typeof message === "string") {
        message = { ...options, content: message };
      }

      await this.interaction.editReply(message);
      return ok(true);
    } catch (e) {
      return error(new ComponentError({
        interaction: this.interaction,
        message: `failed to edit reply to interaction : ${anyToError(e).message}`,
        originalError: anyToError(e),
      }));
    }
  }

  async deferReply(options: InteractionDeferReplyOptions): Promise<ComponentRunResult> {
    try {
      await this.interaction.deferReply(options);
      this.defer = true;
      return ok(true);
    } catch (e) {
      return error(new ComponentError({
        interaction: this.interaction,
        message: `failed to defer reply to interaction : ${anyToError(e).message}}`,
        originalError: anyToError(e),
      }));
    }
  }

  ok(value: string | true): ComponentRunResult {
    return ok(value);
  }

  error(options: Omit<ComponentErrorOptions, "interaction">): ComponentRunResult {
    return error(new ComponentError({ ...options, interaction: this.interaction }));
  }

  async multiple(...funcList: Promise<ComponentRunResult>[]): Promise<ComponentRunResult> {
    for (const func of funcList) {
      const [, err] = await func;

      if (err) {
        return error(err);
      }
    }

    return ok(true);
  }

}

export type GuildComponentContextOptions = {
  member: GuildMember;
  guild: Guild;
  channel: GuildBasedChannel;
};