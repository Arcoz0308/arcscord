import type { ComponentMiddleware } from "#/base/components/component_middleware";
import type {
  ButtonComponentProps,
  ModalComponentProps,
  SelectMenuComponentProps,
} from "#/base/components/component_props.type";

/**
 * Create a select menu
 *
 * @param  options - the properties to configure the select menu
 * @returns  The complete set of properties for the select menu
 * @example
 * ```ts
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
export function createSelectMenu<
  O extends string[],
  M extends ComponentMiddleware[] = ComponentMiddleware[],
>(options: SelectMenuComponentProps<O, M>): SelectMenuComponentProps<O, M> {
  return options;
}

/**
 * create a button
 *
 * @param options - The properties to configure the modal
 * @returns the complete set of properties for the button
 * @example
 * ```ts
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
export function createButton<
  O extends string[],
  M extends ComponentMiddleware[] = ComponentMiddleware[],
>(options: Omit<ButtonComponentProps<O, M>, "type">): ButtonComponentProps<O, M> {
  return { ...options, type: "button" };
}

/**
 * Create a modal
 *
 * @param  options - The properties to configure the modal
 * @returns The complete set of properties for the modal
 * @example
 * ```ts
 * const myFamousModal = createModal({
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
export function createModal<
  O extends string[],
  M extends ComponentMiddleware[] = [],
>(options: Omit<ModalComponentProps<O, M>, "type">): ModalComponentProps<O, M> {
  return { ...options, type: "modal" };
}
