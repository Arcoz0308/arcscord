# @arcscord/error

A error handling package, inspired of golang error handling.

### Exemple

```ts
import { error, ok, Result } from "@arscord/error";

function foo(num: number): Result<boolean, Error> {
  if (num <= 0) {
    return error(new Error("Get negative number"));
  }
  return ok(num % 2 === 0);
}

const [isFoo, err] = foo(3);
if (err) {
  console.error(err);
}
else {
  console.log(isFoo);
}
```

Made by Arcoz with ❤️
