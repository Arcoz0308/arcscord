import type { ModalSubmitInteraction } from "discord.js";
import type { ModalSubmitError } from "#/utils/error/class/modal_submit_error";
import type { Result } from "@arcscord/error";

export type ModalSubmitRunContext = {
  interaction: ModalSubmitInteraction;
  defer: boolean;
}

export type ModalSubmitRunResult = Result<true|string, ModalSubmitError>