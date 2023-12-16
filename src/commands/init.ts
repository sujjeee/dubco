import { handleError } from "@/src/utils/handle-error";
import { logger } from "@/src/utils/logger";
import chalk from "chalk";
import { Command } from "commander";
import Configstore from "configstore";
import ora from "ora";
import prompts from "prompts";

export const init = new Command()
  .name("init")
  .description("configure your dub.co authorization credentails")
  .action(async () => {
    try {
      await promptForConfig();
      logger.info("");
      logger.info(`${chalk.green("Success!")} Configuration completed.`);
      logger.info("");
    } catch (error) {
      handleError(error);
    }
  });

export async function promptForConfig() {
  const highlight = (text: string) => chalk.cyan(text);

  const options = await prompts([
    {
      type: "text",
      name: "authToken",
      message: `Enter your Dub.co ${highlight("Authorization Token")} :`,
      initial: "eyb4411s7saksiall1s2d2"
    },
    {
      type: "text",
      name: "domain",
      message: `Enter your Dub.co ${highlight("Domain")} :`,
      initial: "dub.co"
    },
    {
      type: "text",
      name: "projectSlug",
      message: `Enter your Dub.co ${highlight("Project Slug")} :`,
      initial: "example"
    }
  ]);

  const authorization = {
    authToken: options.authToken,
    domain: options.domain,
    projectSlug: options.projectSlug
  };

  const spinner = ora("Configuring...").start();

  const createConfig = new Configstore("dubco.config");
  createConfig.set(authorization);

  if (!createConfig.path) {
    spinner.stop();
    handleError(new Error("Failed to create config file"));
  }

  spinner.succeed("Configuration completed");
}
