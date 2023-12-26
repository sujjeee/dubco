import os from "os";
import path from "path";
import { DubConfig } from "@/types";
import { getConfig } from "@/utils/get-config";
import { getNanoid } from "@/utils/get-nanoid";
import { getShortLink } from "@/utils/get-shorten-link";
import { handleError } from "@/utils/handle-error";
import { logger } from "@/utils/logger";
import chalk from "chalk";
import { Command } from "commander";
import ora from "ora";
import prompts from "prompts";
import QRCode from "qrcode";
import type { QRCodeToFileOptions } from "qrcode";
import { z } from "zod";

const shortenOptionsSchema = z.object({
  url: z.string().min(3, "URL must be at least 3 characters long"),
  key: z.string().min(1, "Key must be at least 1 character long"),
  qrcode: z.boolean(),
  terminal: z.boolean()
});

type optionSchema = z.infer<typeof shortenOptionsSchema>;

export const shorten = new Command()
  .name("shorten")
  .description("generate a shortened link")
  .argument("[url]", "url to be shortened")
  .argument("[key]", "short key to customize the link", getNanoid())
  .option("-qr, --qrcode", "generate qrcode for shortened url", false)
  .option("-t, --terminal", "draw qrcodes in terminal only", false)
  .action(async (url, key, opts) => {
    try {
      const inputs = { url, key };

      const config = await getConfig();

      if (!config.project.slug) {
        logger.warn(
          `Please visit ${chalk.green(
            "https://dub.co"
          )} to create a new project and try logging in again.`
        );
        process.exit(0);
      }

      if (!config.domain.slug) {
        logger.warn(
          `Domain not found. Please create a new project on ${chalk.green(
            "https://dub.co"
          )} and try logging in again.`
        );
        process.exit(0);
      }

      let givenDetails = inputs;

      if (!inputs.url) {
        const promptsOptions = await prompts(
          [
            {
              type: "text",
              name: "url",
              message: "Enter your Destination URL:"
            },
            {
              type: "text",
              name: "key",
              message: "Enter your Short link:",
              initial: getNanoid()
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

        givenDetails = promptsOptions;
      }

      const options = shortenOptionsSchema.parse({ ...givenDetails, ...opts });

      const link = await runInit(options, config);

      if (!link) {
        logger.warn(
          "Something went wrong. Please try again later or try to logging again."
        );
        logger.info("");
        process.exit(0);
      }

      logger.info("");
      logger.info(`${chalk.green(link)}`);
      logger.info("");

      if (options.qrcode && !options.terminal) {
        const downloadFolder = path.join(os.homedir(), "Downloads");
        const fileName = `dub-${givenDetails.key}.png`;

        const filePath = path.join(downloadFolder, fileName);

        const opts: QRCodeToFileOptions = {
          type: "png",
          width: 800
        };

        QRCode.toFile(filePath, link, opts, (err) => {
          if (err) throw err;
          logger.success("QR code saved!");
          logger.info("");
        });
      }

      if (options.qrcode && options.terminal) {
        QRCode.toString(
          link,
          {
            type: "terminal",
            small: true
          },
          (err, qr) => {
            if (err) throw err;
            logger.success(qr);
            logger.info("");
          }
        );
      }
      if (!config.domain.verified) {
        logger.warn(
          `Domain is not verified. Please visit ${chalk.green(
            "https://dub.co"
          )} to verify your domain and try logging in again.`
        );
        logger.info("");
      }
    } catch (error) {
      handleError(error);
    }
  });

export async function runInit(option: optionSchema, config: DubConfig) {
  const spinner = ora("Shortening URL...").start();
  try {
    const generatedShortLink = await getShortLink({
      url: option.url ?? "",
      shortLink: option.key,
      config
    });

    spinner.succeed("Short link created!");
    return generatedShortLink;
  } catch (error) {
    spinner.stop();
    handleError(error);
  }
}
