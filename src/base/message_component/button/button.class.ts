import { BaseComponent } from "#/base/message_component/base/base_component.class";
import type { ComponentType } from "#/base/message_component/base/base_component.type";

export abstract class ButtonComponent extends BaseComponent {

  type: ComponentType = "button";

}