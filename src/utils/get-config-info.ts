import { logger } from "@/src/utils/logger";
import chalk from "chalk";
import Configstore from "configstore";

export function getConfigInfo() {
  const getconfig = new Configstore("dubco.config");

  if (!getconfig) {
    logger.warn(
      `Configuration is missing. Please run ${chalk.green(
        "init"
      )} to add a dub.co credentials.`
    );
    process.exit(0);
  }

  return getconfig.all;
}
