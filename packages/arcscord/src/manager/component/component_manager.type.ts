import type {
  ButtonComponentHandler,
  ChannelSelectMenuComponentHandler,
  MentionableSelectMenuComponentHandler,
  ModalComponentHandler,
  RoleSelectMenuComponentHandler,
  StringSelectMenuComponentHandler,
  UserSelectMenuComponentHandler,
} from "#/base/components/component_handlers.type";

/**
 * @internal
 */
export type ComponentList = {
  button: Map<string, ButtonComponentHandler>;
  stringSelectMenu: Map<string, StringSelectMenuComponentHandler>;
  userSelectMenu: Map<string, UserSelectMenuComponentHandler>;
  roleSelectMenu: Map<string, RoleSelectMenuComponentHandler>;
  mentionableSelectMenu: Map<string, MentionableSelectMenuComponentHandler>;
  channelSelectMenu: Map<string, ChannelSelectMenuComponentHandler>;
  modal: Map<string, ModalComponentHandler>;
};
