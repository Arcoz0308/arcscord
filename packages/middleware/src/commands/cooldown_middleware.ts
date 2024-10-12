import type { CommandContext, CommandMiddlewareRun, MaybePromise } from "arcscord";
import type { User } from "discord.js";
import type { MessageOptions } from "../type";
import { CommandMiddleware } from "arcscord";

type CooldownMessageOptions = {
  user: User;
  cooldownDuration: number;
  cooldownRemaining: number;
  cooldownEnd: Date;
  commandName: string;
};

export class CooldownMiddleware extends CommandMiddleware {
  name = "cooldown" as const;

  duration: number;

  users: Map<string, number> = new Map();

  message: MessageOptions<CooldownMessageOptions>;

  constructor(duration: number, message: MessageOptions<CooldownMessageOptions>, autoClear: false | number = 3600) {
    super();
    this.duration = duration;
    this.message = message;

    if (autoClear) {
      setInterval(() => {
        this.users.forEach((value, key) => {
          if (value < Date.now())
            this.users.delete(key);
        });
      }, autoClear * 1000);
    }
  }

  run(ctx: CommandContext): MaybePromise<CommandMiddlewareRun<NonNullable<unknown>>> {
    const cooldown = this.users.get(ctx.user.id);
    if (cooldown && cooldown > Date.now()) {
      const cooldownInfos: CooldownMessageOptions = {
        user: ctx.user,
        cooldownDuration: this.duration,
        cooldownRemaining: cooldown - Date.now(),
        cooldownEnd: new Date(cooldown),
        commandName: ctx.interaction.commandName,
      };
      return this.cancel(ctx.defer ? ctx.editReply(this.message(cooldownInfos)) : ctx.reply({ ...this.message(cooldownInfos), ephemeral: true }));
    }

    this.users.set(ctx.user.id, Date.now() + this.duration * 1000);
    return this.next({});
  }
}
