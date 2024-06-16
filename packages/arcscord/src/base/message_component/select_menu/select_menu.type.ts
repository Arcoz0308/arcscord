import type { Result } from "#/utils/error/error.type";
import type { SelectMenuError } from "#/utils/error/class/select_menu_error";
import type { AnySelectMenuInteraction } from "discord.js";


export type SelectMenuRunResult = Result<string|true, SelectMenuError>

export type SelectMenuRunContext = {
  interaction: AnySelectMenuInteraction;
  defer: boolean;
}