import type { SelectMenuError } from "#/utils/error/class/select_menu_error";
import type { AnySelectMenuInteraction } from "discord.js";
import type { Result } from "@arcscord/error";


export type SelectMenuRunResult = Result<string|true, SelectMenuError>

export type SelectMenuRunContext = {
  interaction: AnySelectMenuInteraction;
  defer: boolean;
}