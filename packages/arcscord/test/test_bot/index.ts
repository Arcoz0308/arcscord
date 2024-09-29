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
import process from "node:process";
import { messageEvent } from "./event/message";
import { Partials } from "discord.js";
import { disableAllButton } from "./components/function_test/disable_all";
import { disableRowButton } from "./components/function_test/disableRow";
import { disableComponentButton } from "./components/function_test/disableComponent";
import { editButton } from "./components/function_test/edit";
import { deferEditButton } from "./components/function_test/defer_edit";

const client = new ArcClient(process.env.TOKEN as string, {
  intents: [
    "Guilds",
    "GuildMembers",
    "GuildMessageReactions",
    "DirectMessageReactions",
    "MessageContent",
    "GuildMessages",
  ],
  partials: [
    Partials.Reaction,
    Partials.Message,
    Partials.User,
  ],
});

client.loadEvents([
  messageEvent,
]);

// eslint-disable-next-line @typescript-eslint/no-misused-promises
client.on("ready", async() => {
  await client.loadCommands(commands(client));
  client.loadComponents([
    simpleButton,
    stringSelectMenu,
    userSelectMenu,
    roleSelectMenu,
    mentionableSelectMenu,
    channelSelectMenu,
    modal,
    disableAllButton,
    disableRowButton,
    disableComponentButton,
    editButton,
    deferEditButton,
  ]);
  const [count, err] = await client.commandManager.deleteUnloadedCommands();
  if (err) {
    return client.logger.fatalError(err);
  }
  client.logger.info(`Deleted ${count} unloaded commands`);
});

void client.login();