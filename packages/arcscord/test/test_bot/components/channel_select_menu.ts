import { buildChannelSelectMenu, createSelectMenu } from "#/base/components";

export const channelSelectMenu = createSelectMenu({
  type: "channelSelect",
  matcher: "channel_select_menu",
  build: () => buildChannelSelectMenu({
    customId: "channel_select_menu",
    placeholder: "Select a channel",
  }),
  run: (ctx) => {
    return ctx.reply(`You select channel with type number ${ctx.values[0].type}`);
  },
});