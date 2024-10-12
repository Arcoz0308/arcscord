import type { BaseMessageOptions } from "discord.js";

export type MessageOptions<O extends { [key: string]: unknown } | undefined = undefined> = O extends undefined
  ? BaseMessageOptions
  : (options: O) => BaseMessageOptions;
