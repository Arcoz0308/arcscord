/**
 * Enum for component types.
 * @enum {number}
 * @see [Discord Docs](https://discord.com/developers/docs/interactions/message-components#component-object-component-types)
 */
export enum componentTypesEnum {
  /**
   * Represents an action row component.
   */
  actionRow = 1,
  /**
   * Represents a button component.
   */
  button = 2,
  /**
   * Represents a string select component.
   */
  stringSelect = 3,
  /**
   * Represents a text input component.
   */
  textInput = 4,
  /**
   * Represents a user select component.
   */
  userSelect = 5,
  /**
   * Represents a role select component.
   */
  roleSelect = 6,
  /**
   * Represents a mentionable select component.
   */
  mentionableSelect = 7,
  /**
   * Represents a channel select component.
   */
  channelSelect = 8,
}

/**
 * Enum for button styles.
 * @enum {number}
 * @see [Discord Docs](https://discord.com/developers/docs/interactions/message-components#button-object-button-styles)
 */
export const buttonStyleEnum = {
  /**
   * Represents a primary button style.
   */
  primary: 1,
  /**
   * Represents a secondary button style.
   */
  secondary: 2,
  /**
   * Represents a success button style.
   */
  success: 3,
  /**
   * Represents a danger button style.
   */
  danger: 4,
  /**
   * Represents a link button style.
   */
  link: 5,
};

/**
 * Enum for button style alias with color
 * @enum {number}
 */
export const buttonColorEnum = {
  /**
   * Represents a blurple button color.
   */
  blurple: buttonStyleEnum.primary,
  /**
   * Represents a grey button color.
   */
  grey: buttonStyleEnum.secondary,
  /**
   * Represents a green button color.
   */
  green: buttonStyleEnum.success,
  /**
   * Represents a red button color.
   */
  red: buttonStyleEnum.danger,
};

/**
 * Complete enum for button types, combining styles and colors.
 * @enum {number}
 */
export const buttonTypeEnum = {
  ...buttonStyleEnum,
  ...buttonColorEnum,
};

/**
 * Enum for text input styles.
 * @enum {number}
 * @see [Discord Docs](https://discord.com/developers/docs/interactions/message-components#text-input-object-text-input-styles)
 */
export const textInputStyleEnum = {
  /**
   * Represents a short text input style.
   */
  short: 1,
  /**
   * Represents a paragraph text input style.
   */
  paragraph: 2,
};
