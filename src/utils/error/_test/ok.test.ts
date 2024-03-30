import { describe, expect, it } from "vitest";
import type { ResultOk } from "../error.type";
import { ok } from "../error.util";

describe("ok function", () => {
  it("should return a ResultOk for any value", () => {
    const value = "any value";
    const expected: ResultOk<string> = [value, true];
    const result = ok(value);
    expect(result).toEqual(expected);
  });
});