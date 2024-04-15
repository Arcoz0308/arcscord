import { BaseManager } from "#/base/manager/manager.class";
import type { ButtonComponent } from "#/base/message_component/button/button.class";
import type { SelectMenu } from "#/base/message_component/select_menu/select_menu.class";
import type { ModalSubmitComponent } from "#/base/message_component/modal_submit/modal_submit.class";

export class ComponentManager extends BaseManager {

  name = "components";

  buttons: Map<string, ButtonComponent> = new Map();

  selectMenus: Map<string, SelectMenu> = new Map();

  modalSubmit: Map<string, ModalSubmitComponent> = new Map();


}