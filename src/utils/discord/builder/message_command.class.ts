import { ContextMenuCommandBuilder } from "discord.js";

export class MessageCommandBuilder extends ContextMenuCommandBuilder {

  type = 3;


  /**
   * @deprecated dont use !
   */
  setType(): this {
    return this;
  }

}