import type { ArcClient, BaseComponentContextOptions } from "#/base";
import type { ComponentRunResult } from "#/base/components";
import type { ComponentMiddleware } from "#/base/components/component_middleware";
import type {
  ActionRow,
  MessageActionRowComponent,
  MessageComponentInteraction,
  MessageEditOptions,
  ModalComponentData,
} from "discord.js";
import type { APIActionRowComponent, APIMessageActionRowComponent } from "discord-api-types/v10";
import { BaseComponentContext } from "#/base/components/context/base_context";
import { ComponentError } from "#/utils";
import { anyToError, error, ok } from "@arcscord/error";

/**
 * MessageComponentContext class.
 * Extends ComponentContext and provides context for message component interactions.
 */
export class MessageComponentContext<M extends ComponentMiddleware[] = ComponentMiddleware[]> extends BaseComponentContext<M> {
  interaction: MessageComponentInteraction;

  /**
   * Creates an instance of MessageComponentContext.
   * @param client - The ArcClient instance.
   * @param interaction - The MessageComponentInteraction instance.
   * @param options
   */
  constructor(client: ArcClient, interaction: MessageComponentInteraction, options: BaseComponentContextOptions<M>) {
    super(client, interaction, options);

    this.interaction = interaction;
  }

  /**
   * Shows a modal.
   * @param modal - The ModalComponentData instance.
   * @returns A Promise that resolves to a ComponentRunResult.
   */
  async showModal(modal: ModalComponentData): Promise<ComponentRunResult> {
    try {
      await this.interaction.showModal(modal);
      return ok(true);
    }
    catch (e) {
      return error(
        new ComponentError({
          interaction: this.interaction,
          message: `failed to show modal : ${anyToError(e).message}`,
          originalError: anyToError(e),
        }),
      );
    }
  }

  /**
   * Defers the update message.
   * @returns A Promise that resolves to a ComponentRunResult.
   */
  async deferUpdateMessage(): Promise<ComponentRunResult> {
    try {
      await this.interaction.deferUpdate();
      return ok(true);
    }
    catch (e) {
      return error(
        new ComponentError({
          interaction: this.interaction,
          message: `failed to defer update message : ${anyToError(e).message}`,
          originalError: anyToError(e),
        }),
      );
    }
  }

  /**
   * Updates the message.
   * @param options - The MessageEditOptions instance.
   * @returns A Promise that resolves to a ComponentRunResult.
   */
  async updateMessage(
    options: MessageEditOptions,
  ): Promise<ComponentRunResult> {
    try {
      await this.interaction.update(options);
      return ok(true);
    }
    catch (e) {
      return error(
        new ComponentError({
          interaction: this.interaction,
          message: `failed to update message : ${anyToError(e).message}`,
          originalError: anyToError(e),
        }),
      );
    }
  }

  /**
   * Disables a component.
   * @param selection - The selection criteria ("component" | "actionRow" | "all").
   * @returns A Promise that resolves to a ComponentRunResult.
   *
   * @remarks
   *  component : disable only used component
   *
   *  actionRow : disable all actionRow components
   *
   *  all : disable all message components
   *
   */
  disableComponent(
    selection: "component" | "actionRow" | "all" = "all",
  ): Promise<ComponentRunResult> {
    const components = this.interaction.message.components;
    let newComponents: (
      | APIActionRowComponent<APIMessageActionRowComponent>
      | ActionRow<MessageActionRowComponent>
    )[] = [];

    switch (selection) {
      case "all":
        newComponents = components.map((row) => {
          return {
            ...row.data,
            components: row.components.map((component) => {
              return {
                ...component.data,
                disabled: true,
              };
            }),
          };
        });
        break;
      case "actionRow":
        for (const row of components) {
          if (
            row.components.find(component => this.componentMatch(component))
          ) {
            newComponents.push({
              ...row.data,
              components: row.components.map((component) => {
                return {
                  ...component.data,
                  disabled: true,
                };
              }),
            });
          }
          else {
            newComponents.push(row);
          }
        }
        break;
      case "component":
        for (const row of components) {
          if (
            row.components.find(component => this.componentMatch(component))
          ) {
            newComponents.push({
              ...row.data,
              components: row.components.map((component) => {
                return this.componentMatch(component)
                  ? {
                      ...component.data,
                      disabled: true,
                    }
                  : {
                      ...component.data,
                    };
              }),
            });
          }
          else {
            newComponents.push(row);
          }
        }
    }

    return this.updateMessage({ components: newComponents });
  }

  private componentMatch(component: MessageActionRowComponent): boolean {
    return (
      component.customId === this.interaction.customId
      && component.type === this.interaction.componentType
    );
  }
}
