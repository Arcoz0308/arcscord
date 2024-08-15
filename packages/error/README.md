# @arcscord/error

A error handling package, inspired of golang error handling.

### Exemple

```ts
import { Result, error, ok } from "@arscord/error";

const foo = (num: number): Result<boolean, Error> => {
  if (num <= 0) {
    error(new Error("Get negative number"));
  }
  return ok(num % 2 === 0);
}

const [isFoo, err] = foo(3);
if (err) {
  console.error(err);
} else {
  console.log(isFoo);
}
```

Made by Arcoz with ❤️