import type { ArcClient, BaseComponentContextOptions } from "#/base";
import type { ComponentMiddleware } from "#/base/components/component_middleware";
import type { ButtonInteraction } from "discord.js";
import { MessageComponentContext } from "#/base/components/context/message_component_context";

/**
 * BaseButtonContext class.
 * Extends MessageComponentContext and provides context for button interactions.
 */
export class ButtonContext<M extends ComponentMiddleware[] = ComponentMiddleware[]> extends MessageComponentContext<M> {
  interaction: ButtonInteraction;

  /**
   * Creates an instance of BaseButtonContext.
   * @param client - The ArcClient instance.
   * @param interaction - The ButtonInteraction instance.
   * @param options
   */
  constructor(client: ArcClient, interaction: ButtonInteraction, options: BaseComponentContextOptions<M>) {
    super(client, interaction, options);

    this.interaction = interaction;
  }

  isButtonContext(): this is ButtonContext {
    return true;
  }
}
