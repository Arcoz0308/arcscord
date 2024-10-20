#!/usr/bin/env node

import * as console from "node:console";
import * as process from "node:process";
import { Command } from "commander";
import * as packageJson from "../package.json";

const cli = new Command();

cli
  .name("Arcscord")
  .description("Cli for arcscord framework")
  .version(packageJson.version);

cli.command("ping")
  .action(async () => {
    console.log("Pong !");
  });

cli.parse(process.argv);
