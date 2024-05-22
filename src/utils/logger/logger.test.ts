import { describe, expect, it } from "vitest";
import { formatLog } from "#/utils/logger/logger.util";
import * as console from "console";
import { logger } from "#/utils/logger/logger.class";
import { BaseError } from "#/utils/error/class/base_error.class";

describe("logs texts", () => {
  it("some logs tests", () => {
    console.log(formatLog("trace", "test"));
    console.log(formatLog("debug", "test"));
    console.log(formatLog("info", "test"));
    console.log(formatLog("warning", "test"));
    console.log(formatLog("error", "test"));
    console.log(formatLog("fatal", "test"));

    console.log(formatLog("info", "test2", "database"));


    logger.debug(["name", "zghgu"]);
    logger.error("erroooor", [
      ["author", "arcoz"],
      ["server", "test"],
      ["command", "testing"],
    ]);

    try {
      throw new BaseError({ message: "oook" });
    } catch (error) {
      if (error instanceof BaseError) {
        logger.logError(error);
      }
    }
    expect(0).toBe(0);
  });
});