# Arcscord

[![npm version](https://badge.fury.io/js/arcscord.svg)](https://www.npmjs.com/package/arcscord)
[![Discord Shield](https://discord.com/api/guilds/1012097557532528791/widget.png?style=shield)](https://discord.gg/4geBanVWGR)

## About

Arcscord is a project for simplify creating discord bot with typescript and also some utility package used by core
package !

## Install

`pnpm add arcscord`<br>
or `npm install arcscord`

# Example

- [Command](#command)
- [Button](#button)
- [Select Menu](#select-menu)
- [Modal](#modal)
- [Event](#event)
- [Task](#task)
- [Localization](#localization)

## Command

```ts
// Command declaration
import { createCommand } from "arcscord";
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
      ? ctx.options.user || ctx.user
      : ctx.targetUser;

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

// Command register
await client.loadCommands([avatarCommand]); // need be ready
```

## Button

```ts
// declaration button
import { buildClickableButton, createButton } from "arcscord";

export const simpleButton = createButton({
  matcher: "simple_button",
  build: () => buildClickableButton({
    label: "Simple Button",
    style: "secondary",
    customId: "simple_button",
  }),
  run: (ctx) => {
    return ctx.reply("Clicked !");
  },
});

// usage
message.reply({
  components: [buildButtonActionRow(simpleButton.build())]
});

// register
client.loadComponents([simpleButton]);
```

## Select Menu

```ts
// declaration
import { buildRoleSelectMenu, createSelectMenu } from "arcscord";
import { ComponentType } from "discord-api-types/v10";
import { EmbedBuilder } from "discord.js";

export const roleSelectMenu = createSelectMenu({
  type: ComponentType.RoleSelect,
  matcher: "role_select_menu",
  build: placeHolder => buildRoleSelectMenu({
    placeholder: placeHolder,
    customId: "role_select_menu",
    maxValues: 1,
    minValues: 1,
  }),
  run: (ctx) => {
    const role = ctx.values[0];

    return ctx.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(`Info about role ${role.name}`)
          .setDescription(`Position: ${role.position}\nColor: ${role.color}`)
          .setColor(role.color),
      ],
    });
  },
});

// usage
message.reply({
  components: [roleSelectMenu.build("Select a role")]
});

// register
client.loadComponents([roleSelectMenu]);
```

## Modal

```ts
// declaration
import { buildModal, createModal } from "arcscord";

export const modal = createModal({
  matcher: "modal",
  build: title => buildModal(title, "modal", {
    label: "name",
    style: "short",
    customId: "name",
  }, {
    label: "age",
    style: "short",
    customId: "age",
  }),
  run: (ctx) => {
    return ctx.reply(`Your name is ${ctx.values.get("name")} and you are ${ctx.values.get("age")} old !`);
  },
});

// usage
ctx.showModal(modal.build("funny"));

// register
client.loadComponents([modal]);
```

## Event

```ts
// declaration
import { createEvent } from "arcscord";

export const messageEvent = createEvent({
  event: "messageCreate", // Djs event
  name: "messageCreate", // OPTIONAL name for logs and debug if you want custom name
  run: (ctx, msg) => {
    ctx.client.logger.info(`message send by ${msg.author.username}!`);
    return ctx.ok(true);
  },
});

// register
client.loadEvents([messageEvent]);
```

## Task

```ts
// declaration
import { createTask } from "arcscord";

export const cronTask = createTask({
  interval: "*/10 * * * *", // allowed : duration in ms, cron string or array of cron string
  name: "cron",
  run: (ctx) => {
    console.log(`Running cron task, next run ${ctx.nextRun.toISOString()}`);
    return ctx.ok(true);
  },
});

// register
client.loadTasks([cronTask]);
```

## Localization
full guide soon
```ts
import { createCommand } from "arcscord";

export const i18nCommand = createCommand({
  build: {
    slash: {
      name: "i18n",
      nameLocalizations: t => t("test:i18n.command.name"),
      description: "default description",
      descriptionLocalizations: t => t("test:i18n.command.description"),
    },
  },
  run: (ctx) => {
    return ctx.reply(ctx.t("test:i18n.command.run"), {
      ephemeral: true,
    });
  },
});
```

[Go up](#arcscord)
