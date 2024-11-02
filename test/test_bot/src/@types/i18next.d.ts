import type resources from "./recources";

declare module "i18next" {
  // eslint-disable-next-line ts/consistent-type-definitions
  interface CustomTypeOptions {
    defaultNS: "empty";
    resources: typeof resources;
  }
}