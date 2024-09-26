export const componentTypesEnum = {
  actionRow: 1,
  button: 2,
  stringSelect: 3,
  textInput: 4,
  userSelect: 5,
  roleSelect: 6,
  mentionableSelect: 7,
  channelSelect: 8,
};

export const buttonStyleEnum = {
  primary: 1,
  secondary: 2,
  success: 3,
  danger: 4,
  link: 5,
};

export const buttonColorEnum = {
  blurple: buttonStyleEnum.primary,
  grey: buttonStyleEnum.secondary,
  green: buttonStyleEnum.success,
  red: buttonStyleEnum.danger,
};

export const buttonTypeEnum = {
  ...buttonStyleEnum,
  ...buttonColorEnum,
};

export const textInputStyleEnum = {
  short: 1,
  paragraph: 2,
};