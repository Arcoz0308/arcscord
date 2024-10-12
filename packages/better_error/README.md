# @arcscord/better-error

[![npm version](https://badge.fury.io/js/@arcscord%2Fbetter-error.svg)](https://www.npmjs.com/package/@arcscord/better-error)
[![Discord Shield](https://discord.com/api/guilds/1012097557532528791/widget.png?style=shield)](https://discord.gg/4geBanVWGR)

## About

A package that extends Error class, with more functions like debugs

## Install

`pnpm add @arcscord/better-error`<br>
or `npm install @arcscord/better-error`

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
