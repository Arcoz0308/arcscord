import type { Client } from "#/base/client/client.class";
import type { Event } from "#/base/event/event.class";
import type { ClientEvents } from "discord.js";
import { WelcomeEvent } from "#/events/welcome/welcome.class";

export const eventHandlers = (client: Client): Event<keyof ClientEvents>[] => [
  new WelcomeEvent(client),
];