import { BaseComponent } from "#/base/message_component/base/base_component.class";
import type { ComponentBuilderField, ComponentType } from "#/base/message_component/base/base_component.type";
import type { ModalBuilder } from "@discordjs/builders";
import type { ModalSubmitRunContext } from "#/base/message_component/modal_submit/modal_submit.type";
import type { ButtonRunResult } from "#/base/message_component/button/button.type";

export abstract class ModalSubmitComponent extends BaseComponent {

  type: ComponentType = "modalSubmit";

  abstract builder: ComponentBuilderField<ModalBuilder>

  abstract run(ctx: ModalSubmitRunContext): Promise<ButtonRunResult>;

}