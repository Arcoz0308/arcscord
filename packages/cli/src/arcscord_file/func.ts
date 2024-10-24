import type { Result } from "@arcscord/error";
import type { ArcscordFileData } from "./type";
import * as fs from "node:fs";
import { anyToError, error, ok } from "@arcscord/error";
import { z } from "zod";
import { parsers } from "./versions";

const baseSchema = z.object({
  version: z.number().int().positive().min(0),
});

export async function parseArcscordFile(file = "arcscord.json"): Promise<Result<ArcscordFileData & z.infer<typeof baseSchema>, Error>> {
  const fileContent = fs.readFileSync(file).toString();

  let data;
  try {
    data = JSON.parse(fileContent);
  }
  catch (err) {
    return error(anyToError(err));
  }

  const result = baseSchema.safeParse(data);
  if (!result.success) {
    return error(new Error("Invalid version number in arcscord.json file !"));
  }

  if (!Object.hasOwn(parsers, result.data.version)) {
    return error(new Error(`Version ${result.data.version} not supported by current version of @arcscord/cli, try to update it !`));
  }

  const parser = parsers[result.data.version].parse;

  const [result2, err] = await parser(result.data);
  if (err) {
    return error(err);
  }
  // already check before, no need to more checks
  return ok(result2 as ArcscordFileData & z.infer<typeof baseSchema>);
}
