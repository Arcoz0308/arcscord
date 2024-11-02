import { LocaleManager } from "arcscord";

const resources = {
  arcscord: LocaleManager.arcscordResources.en,
  // for forcing use arcscord namespace but typed correctly
  empty: {},
} as const;

export default resources;
