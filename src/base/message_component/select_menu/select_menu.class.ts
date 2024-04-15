import { BaseComponent } from "#/base/message_component/base/base_component.class";
import type { ComponentType } from "#/base/message_component/base/base_component.type";
import type {
  AnySelectMenuClass,
  ChannelSelectMenuClass,
  MentionableSelectMenuClass,
  RoleSelectMenuClass,
  StringSelectMenuClass,
  UserSelectMenuClass
} from "#/base/message_component/select_menu/select_menu.type";
import { ComponentType as DJSComponentType } from "discord-api-types/v10";

export abstract class SelectMenu<T extends AnySelectMenuClass> extends BaseComponent {

  type: ComponentType = "selectMenu";

  abstract builder: T["builder"];

  authorOnly = false;

  abstract run(ctx: Parameters<T["run"]>): ReturnType<T["run"]>

  isChannelSelect(): this is ChannelSelectMenuClass {
    return this.builder.data.type as DJSComponentType === DJSComponentType.ChannelSelect;
  }

  isMentionableSelect(): this is MentionableSelectMenuClass {
    return this.builder.data.type as DJSComponentType === DJSComponentType.MentionableSelect;
  }

  isRoleSelect(): this is RoleSelectMenuClass {
    return this.builder.data.type as DJSComponentType === DJSComponentType.RoleSelect;
  }

  isStringSelect(): this is StringSelectMenuClass {
    return this.builder.data.type as DJSComponentType === DJSComponentType.StringSelect;
  }

  isUserSelect(): this is UserSelectMenuClass {
    return this.builder.data.type as DJSComponentType === DJSComponentType.UserSelect;
  }


}