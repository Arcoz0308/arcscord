import { Client } from "#/base/client/client.class";
import { env } from "#/utils/config/env";

export const client = new Client(env.TOKEN);

if ((!process.argv.includes("script"))) {
  void client.login();
}