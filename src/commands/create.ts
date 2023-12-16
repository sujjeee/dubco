import type { APIResponse } from "@/src/types";
import { getNanoid } from "@/src/utils/get-nanoid";
import { getShortLink } from "@/src/utils/get-shortlink";
import { handleError } from "@/src/utils/handle-error";
import { logger } from "@/src/utils/logger";
import chalk from "chalk";
import { Command } from "commander";
import fetch from "node-fetch";
import ora from "ora";
import prompts from "prompts";

export const create = new Command()
  .name("create")
  .description("Create short link")
  .option(
    "-c, --cwd <cwd>",
    "the working directory. defaults to the current directory.",
    process.cwd()
  )
  .action(async () => {
    try {
      const res = await promptForShortener();
      logger.info("");
      logger.info(`${chalk.green(res)}`);
      logger.info("");
    } catch (error) {
      handleError(error);
    }
  });

export async function promptForShortener() {
  const highlight = (text: string) => chalk.cyan(text);

  const promptsOptions = await prompts([
    {
      type: "text",
      name: "url",
      message: `Enter your ${highlight("Destination URL")} :`
    },
    {
      type: "text",
      name: "shortLink",
      message: `Enter your ${highlight("Short link")} :`,
      initial: getNanoid()
    }
  ]);

  const spinner = ora("Shortening URL...").start();

  try {
    const generatedShortLink = await getShortLink({
      url: promptsOptions.url,
      shortLink: promptsOptions.shortLink
    });

    return generatedShortLink;
  } catch (error) {
    spinner.fail("Error creating short link!");
    handleError(error);
  }
}
