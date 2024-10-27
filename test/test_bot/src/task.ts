import type { TaskHandler } from "arcscord";
import { cronTask } from "./task/cron";
import { intervalTask } from "./task/interval";
import { multiCronTask } from "./task/multi_cron";

export const tasks: TaskHandler[] = [cronTask, multiCronTask, intervalTask];
