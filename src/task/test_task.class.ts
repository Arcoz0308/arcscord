import { Task } from "#/base/task/task.class";
import type { TaskResult, TaskType } from "#/base/task/task.type";
import { logger } from "#/utils/logger/logger.class";
import { ok } from "#/utils/error/error.util";

export class TestTask extends Task {

  interval = 1000 * 60;

  name = "testTask";

  type: TaskType = "delay";

  run(): TaskResult  {
    logger.trace("run task");
    return ok(true);
  }

}