import { BaseComponent } from "#/base/message_component/base/base_component.class";
import type { ComponentBuilderField, ComponentType } from "#/base/message_component/base/base_component.type";
import type {
  AnySelectMenuBuilder,
  ChannelSelectMenuClass,
  MentionableSelectMenuClass,
  RoleSelectMenuClass,
  SelectMenuRunContext,
  SelectMenuRunResult,
  SelectMenuType,
  StringSelectMenuClass,
  UserSelectMenuClass
} from "#/base/message_component/select_menu/select_menu.type";

export abstract class SelectMenu extends BaseComponent {

  type: ComponentType = "selectMenu";

  abstract builder: ComponentBuilderField<AnySelectMenuBuilder>;

  abstract selectType: SelectMenuType

  abstract run(ctx: SelectMenuRunContext): Promise<SelectMenuRunResult>;

  isChannelSelect(): this is ChannelSelectMenuClass {
    return this.selectType === "channel";
  }

  isMentionableSelect(): this is MentionableSelectMenuClass {
    return this.selectType === "mentionable";
  }

  isRoleSelect(): this is RoleSelectMenuClass {
    return this.selectType === "role";
  }

  isStringSelect(): this is StringSelectMenuClass {
    return this.selectType === "string";
  }

  isUserSelect(): this is UserSelectMenuClass {
    return this.selectType === "user";
  }


}