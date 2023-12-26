import type { DomainInfo, Project } from "@/types";
import { getConfig } from "@/utils/get-config";
import { handleError } from "@/utils/handle-error";
import { logger } from "@/utils/logger";
import { getDomainsInfo, getProjectsInfo } from "@/utils/projects";
import chalk from "chalk";
import { Command } from "commander";
import Configstore from "configstore";
import colorizeJson from "json-colorizer";
import ora from "ora";
import prompts from "prompts";

export const config = new Command()
  .name("config")
  .description("see your configured dub.co credentails")
  .action(async () => {
    const spinner = ora("Getting config file...").start();

    try {
      const configInfo = await getConfig();

      spinner.succeed("Configuration file successfully retrieved.");

      logger.info("");
      console.log(
        colorizeJson(JSON.stringify(configInfo, null, 2), {
          colors: {
            STRING_KEY: "white",
            STRING_LITERAL: "#65B741",
            NUMBER_LITERAL: "#7E30E1"
          }
        })
      );
      logger.info("");
    } catch (error) {
      spinner.stop();
      handleError(error);
    }
  });

config
  .command("set")
  .description("update config file")
  .action(async () => {
    const spinner = ora("Getting config file...").start();

    try {
      const config = await getConfig();

      let projects: Project[] | null = [];
      const showProjects = async () => {
        projects = await getProjectsInfo({
          token: config.token
        });

        if (!projects) {
          spinner.stop();
          logger.warn(
            `Please visit ${chalk.green(
              "https://dub.co"
            )} to create a new project and try logging in again.`
          );
          process.exit(0);
        }

        spinner.stop();

        return projects.map((projects) => ({
          title: `${projects.name} (${projects.slug})`,
          value: projects.slug
        }));
      };

      let domains: DomainInfo[] = [];
      const showDomains = async () => {
        if (!config.project.slug) {
          spinner.stop();
          logger.warn(
            `You can't set a domain. Please visit ${chalk.green(
              "https://dub.co"
            )} to create a new project and try logging in again.`
          );
          process.exit(0);
        }

        domains = await getDomainsInfo({
          token: config.token,
          projectSlug: config.project.slug
        });

        spinner.stop();

        return domains.map((domain) => ({
          title: domain.slug,
          value: domain.slug
        }));
      };

      const options = await prompts(
        [
          {
            type: "select",
            name: "category",
            message: "What would you like to set?",
            choices: [
              { title: "Project", value: "project" },
              { title: "Domain", value: "domain" }
            ]
          },
          {
            type: (prev: string) => (prev === "project" ? "select" : null),
            name: "project",
            message: "Choose a project:",
            choices: await showProjects()
          },
          {
            type: (prev: string) => (prev === "domain" ? "select" : null),
            name: "domain",
            message: "Select a domain from your chosen project:",
            choices: await showDomains()
          }
        ],
        {
          onCancel: () => {
            logger.info("");
            spinner.stop();
            logger.warn("Configuration update cancelled.");
            logger.info("");
            process.exit(0);
          }
        }
      );

      const getconfig = new Configstore("dubco");

      switch (options.category) {
        case "project": {
          const selectedProject = options.project;

          const allProjects = projects.find((p) => p.slug === selectedProject);
          const getDefaultDomain =
            allProjects?.domains.find((d) => d.primary) ||
            allProjects?.domains[0];

          // update the project slug
          getconfig.set("project.slug", options.project ?? null);

          // update the domain slug and verified
          getconfig.set("domain.slug", getDefaultDomain?.slug ?? null);
          getconfig.set("domain.verified", getDefaultDomain?.verified ?? null);

          break;
        }
        case "domain": {
          const selectedDomain = options.domain;
          const getDomainInfo = domains.find((d) => d.slug === selectedDomain);

          getconfig.set("domain.slug", options.domain ?? null);
          getconfig.set("domain.verified", getDomainInfo?.verified ?? null);

          if (!getDomainInfo?.verified) {
            logger.warn(
              `Domain is not verified. Please visit ${chalk.green(
                "https://dub.co"
              )} to verify your domain and try logging in again.`
            );
            logger.info("");
          }

          break;
        }
        default:
          process.exit(0);
      }

      spinner.succeed("Done");

      logger.info("");
      logger.info(`${chalk.green("Success!")} Configuration updated.`);
      logger.info("");
    } catch (error) {
      spinner.stop();
      handleError(error);
    }
  });
