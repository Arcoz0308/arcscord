import type { ModalSubmitInteraction } from "discord.js";
import type { Result } from "#/utils/error/error.type";
import type { ModalSubmitError } from "#/utils/error/class/modal_submit_error";

export type ModalSubmitRunContext = {
  interaction: ModalSubmitInteraction;
  defer: boolean;
}

export type ModalSubmitRunResult = Result<true|string, ModalSubmitError>