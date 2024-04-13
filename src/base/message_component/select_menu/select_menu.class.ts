import { BaseComponent } from "#/base/message_component/base/base_component.class";
import type { ComponentBuilderField, ComponentType } from "#/base/message_component/base/base_component.type";
import type { AnySelectMenuBuilder } from "#/base/message_component/select_menu/select_menu.type";

export abstract class SelectMenu extends BaseComponent {

  type: ComponentType = "selectMenu";

  abstract builder: ComponentBuilderField<AnySelectMenuBuilder>;

}