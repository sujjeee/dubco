import { handleError } from "@/src/utils/handle-error";
import { Command } from "commander";
import ora from "ora";

import { getConfigInfo } from "@/src/utils/get-config-info";

export const config = new Command()
  .name("config")
  .description("see your configured dub.co credentails")
  .action(async () => {
    try {
      const spinner = ora("Getting config file...").start();
      const configInfo = await getConfigInfo();
      spinner.succeed("Config file retrieved");
      console.log(JSON.stringify(configInfo, null, 2));
    } catch (error) {
      handleError(error);
    }
  });
