import * as process from "node:process";
import { ArcClient } from "arcscord";

const client = new ArcClient(process.env.TOKEN ?? "", {
  intents: [],
});

void client.login();
