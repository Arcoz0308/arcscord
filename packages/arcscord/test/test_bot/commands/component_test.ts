import type { ArcClient, CommandContext, CommandRunResult, FullCommandDefinition } from "#/base";
import { Command } from "#/base";
import { buildButtonActionRow } from "#/base/components";
import { simpleButton } from "../components/simple_button";
import { stringSelectMenu } from "../components/string_select_menu";
import { userSelectMenu } from "../components/user_select_menu";
import { roleSelectMenu } from "../components/role_select_menu";
import { mentionableSelectMenu } from "../components/mentionable_select_menu";
import { channelSelectMenu } from "../components/channel_select_menu";

const definer = {
  slash: {
    name: "component-test",
    description: "Components tests",
    options: {
      component: {
        description: "Component to send",
        type: "string",
        choices: [
          {
            name: "simple_button",
            value: "simple_button",
          },
          {
            name: "string_select",
            value: "string_select",
          },
          {
            name: "user_select",
            value: "user_select",
          },
          {
            name: "role_select",
            value: "role_select",
          },
          {
            name: "mentionable_select",
            value: "mentionable_select",
          },
          {
            name: "channel_select",
            value: "channel_select",
          },
        ],
      },
    },
  },
} as const satisfies FullCommandDefinition;

export class ComponentTestCommand extends Command {

  constructor(client: ArcClient) {
    super(client, definer);
  }

  run(ctx: CommandContext<typeof definer>): Promise<CommandRunResult> {
    switch (ctx.options.component) {
      case "simple_button":
        return ctx.reply({
          components: [buildButtonActionRow(simpleButton.build())],
          content: ctx.options.component,
        });
      case "string_select":
        return ctx.reply({
          components: [stringSelectMenu.build("fun", "happy")],
          content: ctx.options.component,
        });
      case "user_select":
        return ctx.reply({
          components: [userSelectMenu.build()],
          content: ctx.options.component,
        });
      case "role_select":
        return ctx.reply({
          components: [roleSelectMenu.build()],
          content: ctx.options.component,
        });
      case "mentionable_select":
        return ctx.reply({
          components: [mentionableSelectMenu.build()],
          content: ctx.options.component,
        });
      case "channel_select":
        return ctx.reply({
          components: [channelSelectMenu.build()],
          content: ctx.options.component,
        });
      default:
        return ctx.reply("No component found");
    }
  }

}