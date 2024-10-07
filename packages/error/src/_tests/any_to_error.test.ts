import { assert, describe, it } from "vitest";
import { anyToError } from "../util";

describe("anyToError", () => {
  it("should return Error object when object is instance of Error", () => {
    const input = new Error("test error");
    const result = anyToError(input);
    assert.instanceOf(result, Error);
    assert.equal(result.message, "test error");
  });

  it("should return Error with string message when input is string", () => {
    const input = "test error";
    const result = anyToError(input);
    assert.instanceOf(result, Error);
    assert.equal(result.message, "test error");
  });

  it("should return Error with JSON string when input is object", () => {
    const input = { error: "test error" };
    const result = anyToError(input);
    assert.instanceOf(result, Error);
    assert.equal(result.message, "{\"error\":\"test error\"}");
  });

  it("should return Error with string representation of input when input is non-object and non-string", () => {
    const input = 123;
    const result = anyToError(input);
    assert.instanceOf(result, Error);
    assert.equal(result.message, String(input));
  });
});
