import { ArcClient } from "#/base/client/client.class";
import { env, isDev } from "#/utils/config/env";
import { logger } from "#/utils/logger/logger.class";

const main = async(): Promise<void> => {

  logger.info("loading bot...");
  const client = new ArcClient(env.TOKEN);
  await client.preLoad();
  logger.info("bot loaded");

  if ((!process.argv.includes("script"))) {

    if (isDev) {
      logger.info("DEV MODE : ENABLED");
    }

    logger.info("bot connecting...");
    await client.login();
  }
};
void main();