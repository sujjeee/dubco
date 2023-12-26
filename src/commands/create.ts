import { DubConfig } from "@/types";
import { getConfig } from "@/utils/get-config";
import { handleError } from "@/utils/handle-error";
import { logger } from "@/utils/logger";
import { createProject } from "@/utils/projects";
import chalk from "chalk";
import { Command } from "commander";
import Configstore from "configstore";
import ora from "ora";
import prompts from "prompts";
import { z } from "zod";

const createOptionsSchema = z.object({
  name: z.string().min(1, "URL must be at least 1 characters long"),
  slug: z.string().min(1, "Slug must be at least 1 characters long"),
  domain: z.string().min(3, "Domain must be at least 3 characters long")
});

type optionSchema = z.infer<typeof createOptionsSchema>;

export const create = new Command();
create
  .name("create")
  .command("project")
  .description("create a new project")
  .action(async () => {
    try {
      const config = await getConfig();

      const promptsOptions = await prompts(
        [
          {
            type: "text",
            name: "name",
            message: "Enter your project name: ",
            initial: "Example Project"
          },
          {
            type: "text",
            name: "slug",
            message: "Enter your project slug:",
            initial: "example-slug"
          },
          {
            type: "text",
            name: "domain",
            message: "Enter your project domain:",
            initial: "example.com"
          }
        ],
        {
          onCancel: () => {
            logger.info("");
            logger.warn("You cancelled the prompt.");
            logger.info("");
            process.exit(0);
          }
        }
      );

      const options = createOptionsSchema.parse(promptsOptions);

      await runInit(options, config);

      logger.info("");
      logger.info("Project created successfully.");
      logger.info("");
      logger.warn(
        `Domain is not verified. Please visit ${chalk.green(
          "https://dub.co"
        )} to verify your domain and try logging in again.`
      );
      logger.info("");
    } catch (error) {
      handleError(error);
    }
  });

export async function runInit(option: optionSchema, config: DubConfig) {
  const spinner = ora("Creating project...").start();

  try {
    const getProjectInfo = await createProject({
      name: option.name,
      slug: option.slug,
      domain: option.domain,
      token: config.token
    });

    const configStore = new Configstore("dubcli");

    configStore.set("project.slug", getProjectInfo[0].value.slug ?? null);
    configStore.set("domain.slug", getProjectInfo[1].value.name ?? null);
    configStore.set(
      "domain.verified",
      getProjectInfo[1].value.verified ?? null
    );

    spinner.succeed("Done");
  } catch (error) {
    spinner.stop();
    handleError(error);
  }
}
