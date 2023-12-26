import type { DubConfig } from "@/types";
import { getUserInfo } from "@/utils/auth/get-user-info";
import { handleError } from "@/utils/handle-error";
import { logger } from "@/utils/logger";
import { getProjectsInfo } from "@/utils/projects";
import chalk from "chalk";
import { Command } from "commander";
import Configstore from "configstore";
import ora from "ora";
import { z } from "zod";

const loginOptionsSchema = z.object({
  token: z.string().min(8, "Token must be at least 8 characters long")
});

export const login = new Command()
  .name("login")
  .description("configure your dub.co authorization credentials")
  .argument("<token>", "api token for authentication")
  .action(async (token) => {
    const spinner = ora("Verifying user credentials...").start();
    try {
      const options = loginOptionsSchema.parse({ token });
      const userInfo = await getUserInfo({ token: options.token });

      if (!userInfo) {
        spinner.stop();
        logger.warn(
          `Please visit ${chalk.green(
            "https://dub.co"
          )} to generate your token.`
        );
        process.exit(0);
      }

      const projectsInfo = await getProjectsInfo({ token: options.token });

      const defaultProject = projectsInfo ? projectsInfo[0] : null;
      const defaultDomain = projectsInfo
        ? projectsInfo[0]?.domains.find((domain) => domain.primary) ||
          projectsInfo[0]?.domains[0]
        : null;

      const defaultInfo = {
        project: {
          slug: defaultProject?.slug ?? null
        },
        domain: {
          slug: defaultDomain?.slug ?? null,
          verified: defaultDomain?.verified ?? null
        }
      };

      const configInfo: DubConfig = {
        token: options.token,
        ...userInfo,
        ...defaultInfo
      };

      const config = new Configstore("dubco");

      if (!config.path) {
        spinner.stop();
        handleError(new Error("Failed to create config file."));
      }

      // 1: clear the config
      config.clear();

      // 2: set new dub credentials
      config.set(configInfo);

      spinner.succeed("Done");

      logger.info("");
      logger.info(`${chalk.green("Success!")} Dub authentication completed.`);
      logger.info("");
    } catch (error) {
      spinner.stop();
      handleError(error);
    }
  });
