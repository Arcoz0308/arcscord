import { rm } from "node:fs/promises";

const rootDir = new URL("../", import.meta.url);
const packagesDir = new URL("packages/", rootDir);
const options = { recursive: true, force: true };

const paths = [
  // Dist folders
  new URL("arcscord/dist/", packagesDir),
  new URL("better-error/dist/", packagesDir),
  new URL("error/dist/", packagesDir),
  new URL("middleware/dist/", packagesDir),
];

await Promise.all(paths.map(path => rm(path, options)));
