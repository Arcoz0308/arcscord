import type { ButtonError } from "#/utils/error/class/button_error";
import type { ButtonInteraction } from "discord.js";
import type { Result } from "@arcscord/error";

export type ButtonRunResult = Result<string|boolean, ButtonError>

export type ButtonRunContext = {
  interaction: ButtonInteraction;
  defer: boolean;
}