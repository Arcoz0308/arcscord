import type resources from "./recources";

declare module "i18next" {
  // eslint-disable-next-line ts/consistent-type-definitions
  interface CustomTypeOptions {
    defaultNS: "test";
    resources: typeof resources;
  }
}
