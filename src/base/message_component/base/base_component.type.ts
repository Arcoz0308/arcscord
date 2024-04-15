import type { componentTypes } from "#/base/message_component/base/base_component.enum";
import type { ButtonComponent } from "#/base/message_component/button/button.class";
import type { ModalSubmitComponent } from "#/base/message_component/modal_submit/modal_submit.class";
import type { MessageActionRowComponentBuilder, ModalBuilder } from "@discordjs/builders";
import type { AnySelectMenu } from "#/base/message_component/select_menu/select_menu.type";

export type ComponentType = keyof typeof componentTypes;
export type Component = ButtonComponent|ModalSubmitComponent|AnySelectMenu;

type ComponentBuilder = MessageActionRowComponentBuilder|ModalBuilder;

export type ComponentBuilderField<T extends ComponentBuilder = ComponentBuilder> = T | ((...args: unknown[]) => T);