import { describe, expect, it } from "vitest";
import { formatLog } from "./logger.util";
import * as console from "console";
import { defaultLogger } from "./logger.class";
import { BaseError } from "@arcscord/better-error";

describe("logs texts", () => {
  it("some logs tests", () => {
    console.log(formatLog("trace", "test"));
    console.log(formatLog("debug", "test"));
    console.log(formatLog("info", "test"));
    console.log(formatLog("warning", "test"));
    console.log(formatLog("error", "test"));
    console.log(formatLog("fatal", "test"));

    console.log(formatLog("info", "test2", "database"));


    defaultLogger.debug(["name", "zghgu"]);
    defaultLogger.error("erroooor", [
      ["author", "arcoz"],
      ["server", "test"],
      ["command", "testing"],
    ]);

    try {
      throw new BaseError({ message: "oook" });
    } catch (error) {
      if (error instanceof BaseError) {
        defaultLogger.logError(error);
      }
    }
    expect(0).toBe(0);
  });
});