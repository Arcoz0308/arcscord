import { BaseManager } from "#/base/manager/manager.class";
import { ButtonComponent } from "#/base/message_component/button/button.class";
import { ModalSubmitComponent } from "#/base/message_component/modal_submit/modal_submit.class";
import type { AnySelectMenu } from "#/base/message_component/select_menu/select_menu.type";
import type { Component } from "#/base/message_component/base/base_component.type";
import { SelectMenu } from "#/base/message_component/select_menu/select_menu.class";

export class ComponentManager extends BaseManager {

  name = "components";

  buttons: Map<string, ButtonComponent> = new Map();

  selectMenus: Map<string, AnySelectMenu> = new Map();

  modalSubmit: Map<string, ModalSubmitComponent> = new Map();

  loadComponent(component: Component): void {
    if (component.type === "button" && component instanceof ButtonComponent) {
      return this.loadButton(component);
    }

    if (component.type === "modalSubmit" && component instanceof ModalSubmitComponent) {
      return this.loadModalSubmit(component);
    }

    if (component.type === "selectMenu" && component instanceof SelectMenu) {
      return this.loadSelectMenu(component);
    }
  }

  loadButton(component: ButtonComponent): void {

  }

  loadModalSubmit(component: ModalSubmitComponent): void {

  }

  loadSelectMenu(component: AnySelectMenu): void {

  }


}