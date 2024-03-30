import { describe, expect, it } from "vitest";
import type { Result } from "../error.type";
import { error } from "../error.util";

describe("error function test", () => {
  it("Should return the error and false", () => {
    class CustomError extends Error {}

    const customError = new CustomError("Test error");
    const expectedOutput: Result<unknown, CustomError> = [customError, false];

    const output = error<unknown, CustomError>(customError);

    expect(output).toEqual(expectedOutput);
  });
});