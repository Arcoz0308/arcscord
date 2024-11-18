import type { ArcClient, BaseComponentContextOptions } from "#/base";
import type { ComponentMiddleware } from "#/base/components/component_middleware";
import type { ModalSubmitInteraction } from "discord.js";
import { BaseComponentContext } from "#/base/components/context/base_context";

/**
 * `DmModalContext` is a class representing the context of a modal interaction within a direct message (DM).
 */
export class ModalContext<M extends ComponentMiddleware[] = ComponentMiddleware[]> extends BaseComponentContext<M> {
  interaction: ModalSubmitInteraction;

  /**
   * Map of field custom IDs to their values.
   */
  values: Map<string, string>;

  /**
   * Constructs a DM modal context.
   * @param client - The ArcClient instance.
   * @param interaction - The modal submit interaction.
   * @param options
   */
  constructor(client: ArcClient, interaction: ModalSubmitInteraction, options: BaseComponentContextOptions<M>) {
    super(client, interaction, options);

    this.interaction = interaction;

    this.values = new Map<string, string>(
      interaction.fields.fields.map(field => [field.customId, field.value]),
    );
  }

  isModalContext(): this is ModalContext {
    return true;
  }
}
