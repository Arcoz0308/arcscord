import type { Result } from "#/utils/error/error.type";
import type { ButtonError } from "#/utils/error/class/button_error.class";
import type { ButtonInteraction } from "discord.js";

export type ButtonRunResult = Result<string|boolean, ButtonError>

export type ButtonRunContext = {
  interaction: ButtonInteraction;
  defer: boolean;
}