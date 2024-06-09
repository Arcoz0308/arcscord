import type { DevFacultative } from "./dev.type";

type ClassDecorator<R> = {
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  new(...args: any[]): R;
};

export const Dev = <T extends ClassDecorator<DevFacultative>>(target: T) => {
  return class extends target {

    isEnableInDev = true;

  };
};