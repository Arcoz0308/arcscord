import { ArcClient } from "#/base";
import { commands } from "./commands";
import "dotenv/config";
import { simpleButton } from "./components/simple_button";
import { stringSelectMenu } from "./components/string_select_menu";
import { userSelectMenu } from "./components/user_select_menu";
import { roleSelectMenu } from "./components/role_select_menu";
import { mentionableSelectMenu } from "./components/mentionable_select_menu";
import { channelSelectMenu } from "./components/channel_select_menu";
import { modal } from "./components/modal";

const client = new ArcClient(process.env.TOKEN as string, {
  intents: [
    "Guilds",
    "GuildMembers",
  ],
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
client.on("ready", async() => {
  void client.loadCommands(commands(client));
  void client.loadComponents([
    simpleButton,
    stringSelectMenu,
    userSelectMenu,
    roleSelectMenu,
    mentionableSelectMenu,
    channelSelectMenu,
    modal,
  ]);
});

void client.login();