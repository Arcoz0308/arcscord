import { BaseManager } from "#/base/manager/manager.class";
import type { BaseMessageOptions, MessageComponentInteraction, ModalSubmitInteraction } from "discord.js";
import type { ArcClient } from "#/base";
import { anyToError } from "@arcscord/error";
import type { BaseComponentProps, ComponentProps } from "#/base/components/component_props.type";

export class ComponentManager extends BaseManager {

  name = "components";

  components: Map<`${BaseComponentProps["type"]}_${string}`, ComponentProps> = new Map();

  constructor(client: ArcClient) {
    super(client);

    client.on("interactionCreate", (interaction) => {
      if (interaction.isMessageComponent() || interaction.isModalSubmit()) {
      }
    });
  }


  async sendError(interaction: MessageComponentInteraction | ModalSubmitInteraction, message: BaseMessageOptions, defer: boolean = false):
    Promise<void> {
    try {
      if (defer) {
        await interaction.editReply(message);
      } else {
        await interaction.reply({
          ...message,
          ephemeral: true,
        });
      }
    } catch (e) {
      this.logger.error("failed to send error message", {
        baseError: anyToError(e).message,
      });
    }
  }

}