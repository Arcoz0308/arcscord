import type { z } from "zod";
import type { devConfigSchema } from "#/manager/dev/dev.z";

export type DevFacultative = {
  isEnableInDev: boolean;
  name: string;
}

export type DevConfig = z.infer<typeof devConfigSchema>
export type DevConfigKey = Exclude<keyof DevConfig, "config">;