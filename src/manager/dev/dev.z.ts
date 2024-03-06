import { z } from "zod";

export const devConfigSchema = z.object({
  commands: z.array(z.string()),
  events: z.array(z.string()),
  tasks: z.array(z.string()),
});