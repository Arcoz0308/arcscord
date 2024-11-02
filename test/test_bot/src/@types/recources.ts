import { LocaleManager } from "arcscord";
import testNS from "../locale/en.json";

const resources = {
  arcscord: LocaleManager.arcscordResources.en,
  test: testNS,
  // for forcing use arcscord namespace but typed correctly
  empty: {},
} as const;

export default resources;
