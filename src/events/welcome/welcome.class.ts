import { Event } from "#/base/event/event.class";
import type { GuildMember } from "discord.js";
import { isGuildTextChannel } from "#/utils/discord/utils/util.func";
import type { EventHandleResult } from "#/base/event/event.type";
import { anyToError, error, ok } from "#/utils/error/error.util";
import { EventError } from "#/utils/error/class/event_error.class";

export class WelcomeEvent extends Event<"guildMemberAdd"> {

  event = "guildMemberAdd" as const;

  name = "welcome";

  async handle(member: GuildMember): Promise<EventHandleResult> {
    const guild = member.guild;
    const welcome = guild.systemChannel || guild.channels.cache.filter((channel) => isGuildTextChannel(channel)).first();

    if (!welcome || !welcome.isTextBased() || welcome.isVoiceBased()) {
      return ok("noChannel");
    }
    try {
      await welcome.send(`welcome ${member.toString()}`);
      return ok(true);
    } catch (e) {
      return error(new EventError({
        message: `failed to send welcome message : ${anyToError(e).message}`,
        event: this,
        baseError: anyToError(e),
      }));
    }


  }

}