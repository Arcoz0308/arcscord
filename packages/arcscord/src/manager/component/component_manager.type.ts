import type {
  ButtonComponentProps,
  ChannelSelectMenuComponentProps,
  MentionableSelectMenuComponentProps,
  ModalComponentProps,
  RoleSelectMenuComponentProps,
  StringSelectMenuComponentProps,
  UserSelectMenuComponentProps,
} from "#/base/components/component_props.type";

/**
 * @internal
 */
export type ComponentList = {
  button: Map<string, ButtonComponentProps>;
  stringSelectMenu: Map<string, StringSelectMenuComponentProps>;
  userSelectMenu: Map<string, UserSelectMenuComponentProps>;
  roleSelectMenu: Map<string, RoleSelectMenuComponentProps>;
  mentionableSelectMenu: Map<string, MentionableSelectMenuComponentProps>;
  channelSelectMenu: Map<string, ChannelSelectMenuComponentProps>;
  modal: Map<string, ModalComponentProps>;
};
