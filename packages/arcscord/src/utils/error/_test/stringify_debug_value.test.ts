import { describe, expect, it } from "vitest";
import { stringifyDebugValue } from "../error.util";

describe("stringifyDebugValue", () => {
  it("works with string value", () => {
    const testKey = "testKey";
    const value = "testString";
    const expected = [testKey, "testString"];

    const result = stringifyDebugValue(testKey, value);
    expect(result).toEqual(expected);
  });

  it("works with number value", () => {
    const testKey = "testKey";
    const value = 123;
    const expected = [testKey, "123"];

    const result = stringifyDebugValue(testKey, value);
    expect(result).toEqual(expected);
  });

  it("works with object value", () => {
    const testKey = "testKey";
    const value = { a: 1, b: "test" };
    const expected = [testKey, "{\"a\":1,\"b\":\"test\"}"];

    const result = stringifyDebugValue(testKey, value);
    expect(result).toEqual(expected);
  });

  it("works with boolean value", () => {
    const testKey = "testKey";
    const value = true;
    const expected = [testKey, "true"];

    const result = stringifyDebugValue(testKey, value);
    expect(result).toEqual(expected);
  });

  it("works with undefined value", () => {
    const testKey = "testKey";
    const value = undefined;
    const expected = [testKey, "undefined"];

    const result = stringifyDebugValue(testKey, value);
    expect(result).toEqual(expected);
  });

  it("works with object has toJson(value)", () => {
    const testKey = "testKey";
    const value = { toJson: () => "{\"c\":1,\"d\":\"test\"}" };
    const expected = [testKey, "{\"c\":1,\"d\":\"test\"}"];

    const result = stringifyDebugValue(testKey, value);
    expect(result).toEqual(expected);
  });
});