import { buildChannelSelectMenu, createSelectMenu } from "arcscord";
import { ComponentType } from "discord.js";

export const channelSelectMenu = createSelectMenu({
  type: ComponentType.ChannelSelect,
  matcher: "channel_select_menu",
  build: () =>
    buildChannelSelectMenu({
      customId: "channel_select_menu",
      placeholder: "Select a channel",
    }),
  run: (ctx) => {
    return ctx.reply(
      `You select channel with type number ${ctx.values[0].type}`,
    );
  },
});
