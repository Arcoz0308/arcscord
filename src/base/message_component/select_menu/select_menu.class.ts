import { BaseComponent } from "#/base/message_component/base/base_component.class";
import type { ComponentType } from "#/base/message_component/base/base_component.type";
import type {
  AnySelectMenuBuilder,
  SelectMenuRunContext,
  SelectMenuRunResult
} from "#/base/message_component/select_menu/select_menu.type";

export abstract class SelectMenu extends BaseComponent {

  type: ComponentType = "selectMenu";


  abstract builder: AnySelectMenuBuilder;

  authorOnly: boolean = false;

  abstract run(ctx: SelectMenuRunContext): Promise<SelectMenuRunResult>

}