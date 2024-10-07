import { describe, expect, it } from "vitest";
import { error, forceSafe, ok } from "../func"; // adjust to the module where those functions are located

describe("forceSafe", () => {
  it("should return a Result object with the result when the function is successful", async () => {
    const successfulFunction = () => "success";
    const result = await forceSafe(successfulFunction);
    expect(result).toEqual(ok("success"));
  });

  it("should return a Result object with an error when the function throws an error", async () => {
    const errorFunction = () => {
      throw "error";
    };
    const result = await forceSafe(errorFunction);
    expect(result).toEqual(error(new Error("error")));
  });

  it("should handle errors not thrown as Error instances", async () => {
    const errorFunction = () => {
      throw 123;
    };
    const result = await forceSafe(errorFunction);
    expect(result).toEqual(error(new Error("123")));
  });

  it("should handle successful promise", async () => {
    const promiseFunction = () => new Promise(resolve => resolve("success"));
    const result = await forceSafe(promiseFunction);
    expect(result).toEqual(ok("success"));
  });

  it("should handle promise that throws an error", async () => {
    const errorPromiseFunction = () =>
      new Promise((_, reject) => reject("error"));
    const result = await forceSafe(errorPromiseFunction);
    expect(result).toEqual(error(new Error("error")));
  });
});
