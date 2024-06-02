import type { ArcClient } from "#/base/client/client.class";
import type { Task } from "#/base/task/task.class";
import { TestTask } from "#/task/test_task.class";

export const taskList = (client: ArcClient): Task[] => [
  new TestTask(client),
];