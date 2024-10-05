# Arcscord

[![npm version](https://badge.fury.io/js/arcscord.svg)](https://github.com/Arcoz0308/arcscord/tree/main/packages/better_error)

## About

Arcscord is a project for simplify creating discord bot with typescript and also some utility package used by core
package !

## Install

`pnpm add arcscord`<br>
or `npm install arcscord`

# Example

```ts
import { createCommand } from "#/base/command/command_func";
import { EmbedBuilder } from "discord.js";

export const avatarCommand = createCommand({
  build: {
    slash: {
      name: "avatar",
      description: "test command",
      options: {
        user: {
          type: "user",
          description: "The user",
        },
        size: {
          type: "number",
          description: "yeah",
          choices: [
            512,
            {
              name: "1024 (default)",
              value: 1024,
            },
            2048,
          ],
        } as const,
      },
    },
    user: {
      name: "avatar",
    },
  },
  run: (ctx) => {
    const user = ctx.isSlashCommand
      ? ctx.options.user || ctx.user : ctx.targetUser;

    return ctx.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(`Avatar de ${user.displayName}`)
          .setImage(user.displayAvatarURL({
            size: ctx.isSlashCommand ? ctx.options.size || 1024 : 1024,
          }) || user.defaultAvatarURL),
      ],
      ephemeral: true,
    });
  },
});
```