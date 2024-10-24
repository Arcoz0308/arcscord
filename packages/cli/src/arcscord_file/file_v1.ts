import type { ArcscordFileParser } from "./type";
import { error, ok } from "@arcscord/error";
import { z } from "zod";

const elementSchema = z.object({
  name: z.string(),
  path: z.string(),
});

const fileDataSchema = z.object({
  commands: elementSchema.array(),
  events: elementSchema.array(),
  components: elementSchema.array(),
  tasks: elementSchema.array(),
  packageManager: z.object({
    type: z.enum(["npm", "pnpm", "yarn"]),
  }),
});

export const fileV1: ArcscordFileParser = {
  version: 1,
  parse: (data) => {
    const result = fileDataSchema.safeParse(data);
    if (!result.success) {
      return error(result.error);
    }
    return ok(result.data);
  },
};
