import type { TypedSelectMenuOptions } from "#/base/components/component_definer.type";
import type {
  ButtonComponentProps,
  ModalComponentProps,
  SelectMenuComponentProps
} from "#/base/components/component_props.type";

/**
 * Create a select menu
 *
 * @param {SelectMenuComponentProps<O, T>} options - the properties to configure the select menu
 * @returns {SelectMenuComponentProps<O, T>} The complete set of properties for the select menu
 * @example ```ts
 * const selectMenu = createSelectMenu({
 *   type: "userSelect",
 *   matcher: "selectMenu",
 *   build: () => buildUserSelectMenu({
 *     customId: "selectMenu",
 *     maxValues: 10,
 *     minValues: 1,
 *   }),
 *   run: (ctx) => {
 *     return ctx.reply(`You select ${ctx.values.length} users`);
 *   },
 * });
 * ```
 */
export const createSelectMenu = <
  O extends string[], T extends TypedSelectMenuOptions | undefined>(options: SelectMenuComponentProps<O, T
>): SelectMenuComponentProps<O, T> => {
  return options;
};

/**
 * create a button
 *
 * @param {Omit<ButtonComponentProps<O>, "type">} options - The properties to configure the modal
 * @returns {ButtonComponentProps<O>} the complete set of properties for the button
 * @example ```ts
 * const button = createButton({
 *   matcher: "button",
 *   build: () => buildClickableButton({
 *     style: "success",
 *     customId: "button",
 *     label: "Click Here",
 *   }),
 *   run: (ctx) => {
 *     return ctx.reply("You clicked !");
 *   },
 * });
 * ```
 */
export const createButton = <O extends string[]>(options: Omit<ButtonComponentProps<O>, "type">): ButtonComponentProps<O> => {
  return { ...options, type: "button" };
};

/**
 * Create a modal
 *
 * @param {Omit<ModalComponentProps<O>, "type">} options - The properties to configure the modal
 * @returns {ModalComponentProps<O>} The complete set of properties for the modal
 * @example ```ts
 * const myFamusModal = createModal({
 *   matcher: "famousModal",
 *   build: (label) => buildModal(label, "famousModal", {
 *     style: "short",
 *     label: "entry",
 *     customId: "entry",
 *   }),
 *   run: (ctx) => {
 *     return ctx.reply(`You reply with ${ctx.values.get("entry") || "nothing"}`);
 *   },
 * });
 * ```
 *
 */
export const createModal = <O extends string[]>(options: Omit<ModalComponentProps<O>, "type">): ModalComponentProps<O> => {
  return { ...options, type: "modal" };
};