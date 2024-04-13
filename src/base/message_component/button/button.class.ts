import { BaseComponent } from "#/base/message_component/base/base_component.class";
import type { ComponentBuilderField, ComponentType } from "#/base/message_component/base/base_component.type";
import type { ButtonBuilder } from "@discordjs/builders";

export abstract class ButtonComponent extends BaseComponent {

  type: ComponentType = "button";

  abstract builder: ComponentBuilderField<ButtonBuilder>;

}