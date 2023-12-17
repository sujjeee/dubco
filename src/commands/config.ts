import { getConfigInfo } from "@/src/utils/get-config-info";
import { handleError } from "@/src/utils/handle-error";
import { logger } from "@/src/utils/logger";
import { Command } from "commander";
import ora from "ora";

export const config = new Command()
  .name("config")
  .description("see your configured dub.co credentails")
  .action(async () => {
    try {
      const spinner = ora("Getting config file...").start();
      const configInfo = await getConfigInfo();
      spinner.succeed("Config file retrieved");
      logger.info(JSON.stringify(configInfo, null, 4));
    } catch (error) {
      handleError(error);
    }
  });
