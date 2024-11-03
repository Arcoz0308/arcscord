import { LocaleManager } from "arcscord";
import en from "../locale/en.json";

const resources = {
  arcscord: LocaleManager.arcscordResources.en,
  translations: en,
} as const;

export default resources;
