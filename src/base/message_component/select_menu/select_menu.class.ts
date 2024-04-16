import { BaseComponent } from "#/base/message_component/base/base_component.class";
import type { ComponentType } from "#/base/message_component/base/base_component.type";
import type { AnySelectMenuClass } from "#/base/message_component/select_menu/select_menu.type";

export abstract class SelectMenu<T extends AnySelectMenuClass> extends BaseComponent {

  type: ComponentType = "selectMenu";

  abstract builder: T["builder"];

  authorOnly = false;

  abstract run(ctx: Parameters<T["run"]>[0]): ReturnType<T["run"]>


}