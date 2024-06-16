import { BaseComponent } from "#/base/message_component/base/base_component.class";
import type { ComponentBuilderField, ComponentType } from "#/base/message_component/base/base_component.type";
import type { ButtonBuilder } from "@discordjs/builders";
import type { ButtonRunContext, ButtonRunResult } from "#/base/message_component/button/button.type";

export abstract class Button extends BaseComponent {

  type: ComponentType = "button";

  abstract builder: ComponentBuilderField<ButtonBuilder>;

  authorOnly = false;

  abstract run(ctx: ButtonRunContext): Promise<ButtonRunResult>

}