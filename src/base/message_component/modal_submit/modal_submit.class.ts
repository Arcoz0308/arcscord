import { BaseComponent } from "#/base/message_component/base/base_component.class";
import type { ComponentBuilderField, ComponentType } from "#/base/message_component/base/base_component.type";
import type { ModalBuilder } from "@discordjs/builders";

export abstract class ModalSubmitComponent extends BaseComponent {

  type: ComponentType = "modalSubmit";

  abstract builder: ComponentBuilderField<ModalBuilder>

}