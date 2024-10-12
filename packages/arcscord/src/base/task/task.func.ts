import type { Task } from "#/base/task/task.type";

/**
 * Create a task with the specified options.
 * @param options - The options for the task, including interval, name, and run function.
 * @returns The created task.
 *
 * @example ```ts
 * // Create a task that runs every minute (type: cron expression)
 * const minuteTask = createTask({
 *   interval: '* * * * *',
 *   name: 'MinuteTask',
 *   run: async (ctx) => {
 *     console.log('Task is running every minute.');
 *     return ctx.ok();
 *   }
 * });
 * ```
 *
 * @example ```ts
 * // Create a task that runs at multiple specified times (type: array of cron expressions)
 * const multipleTimesTask = createTask({
 *   interval: ['0 0 * * *', '30 14 * * *'],
 *   name: 'MultipleTimesTask',
 *   run: async (ctx) => {
 *     console.log('Task is running at specified times.');
 *     return ctx.ok();
 *   }
 * });
 * ```
 *
 * @example ```ts
 * // Create a task that runs every 5000 milliseconds (type: duration in milliseconds)
 * const milliTask = createTask({
 *   interval: 5000,
 *   name: 'MillisecondsTask',
 *   run: async (ctx) => {
 *     console.log('Task is running every 5000 milliseconds.');
 *     return ctx.ok();
 *   }
 * });
 * ```
 */
export function createTask(options: Task): Task {
  return options;
}
