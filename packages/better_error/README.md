# @arcscord/better-error

## About

A package that extends Error class, with more functions like debugs

## Example

```ts
import { BaseError } from "@arcscord/better-error";

const error = new BaseError({
  message: "A error happen",
  debugs: {
    when: "now",
  }
});
```
