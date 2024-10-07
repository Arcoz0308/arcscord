import { assert, describe, it } from "vitest";
import { stringifyUnknown } from "../util";

describe("stringifyUnknown", () => {
  it("should stringify string correctly", () => {
    const result = stringifyUnknown("Hello, world!");
    assert.equal(result, "\"Hello, world!\"");
  });

  it("should stringify number correctly", () => {
    const result = stringifyUnknown(42);
    assert.equal(result, "42");
  });

  it("should stringify bigint correctly", () => {
    const result = stringifyUnknown(1234567890123456789n);
    assert.equal(result, "1234567890123456789n");
  });

  it("should stringify boolean correctly", () => {
    const result = stringifyUnknown(true);
    assert.equal(result, "true");
  });

  it("should stringify undefined correctly", () => {
    const result = stringifyUnknown(undefined);
    assert.equal(result, "undefined");
  });

  it("should stringify object correctly", () => {
    const result = stringifyUnknown({ foo: "bar" });
    assert.equal(result, "{\"foo\":\"bar\"}");
  });

  it("should stringify null correctly", () => {
    const result = stringifyUnknown(null);
    assert.equal(result, "null");
  });

  it("should stringify symbol correctly", () => {
    const result = stringifyUnknown(Symbol("foo"));
    assert.equal(result, "Symbol(foo)");
  });

  it("should stringify function correctly", () => {
    const result = stringifyUnknown(() => "foo");
    assert.equal(result, "() => \"foo\"");
  });

  it("should return unknown for unstringifyable values", () => {
    const circular: { self?: NonNullable<unknown> } = {};
    circular.self = circular;
    const result = stringifyUnknown(circular);
    assert.equal(result, "unknown");
  });
});
