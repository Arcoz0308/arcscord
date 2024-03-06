import { ContextMenuCommandBuilder } from "discord.js";

export class UserCommandBuilder extends ContextMenuCommandBuilder {

  type = 2;


  /**
   * @deprecated dont use !
   */
  setType(): this {
    return this;
  }

}