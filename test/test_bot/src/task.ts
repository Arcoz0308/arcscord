import type { Task } from "arcscord";
import { cronTask } from "./task/cron";
import { intervalTask } from "./task/interval";
import { multiCronTask } from "./task/multi_cron";

export const tasks: Task[] = [cronTask, multiCronTask, intervalTask];
