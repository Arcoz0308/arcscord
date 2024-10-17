import type { SlashWithSubsCommandDefinition } from "arcscord";
import { autocompleteSubCommand } from "./autocomplete";
import { buttonComponentSubCommand, modalComponentSubCommand, stringSelectMenuComponentSubCommand } from "./component";
import { testMiddlewareSubCommand } from "./middleware";

export const subCommand = {
  name: "sub",
  description: "sub command",
  subCommands: [
    autocompleteSubCommand,
    testMiddlewareSubCommand,
  ],
  subCommandsGroups: {
    component: {
      description: "components tests",
      subCommands: [
        buttonComponentSubCommand,
        modalComponentSubCommand,
        stringSelectMenuComponentSubCommand,
      ],
    },
    other: {
      description: "Other sub commands tests",
      subCommands: [
        testMiddlewareSubCommand,
      ],
    },
  },
} satisfies SlashWithSubsCommandDefinition;
