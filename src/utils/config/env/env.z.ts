import { z } from "zod";

export const envSchema = z.object({
  TOKEN: z.string(),
  DEV_FILE_PATH: z.string().optional(),
});