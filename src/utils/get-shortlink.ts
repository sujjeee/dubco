import { APIResponse, ConfigTypes, LinkOptions } from "@/src/types";
import { handleError } from "@/src/utils/handle-error";
import { logger } from "@/src/utils/logger";
import chalk from "chalk";
import Configstore from "configstore";
import fetch from "node-fetch";

export async function getShortLink({ url, shortLink }: LinkOptions) {
  const getconfig = new Configstore("dubco.config");

  console.log("getconfig", getconfig);
  console.log("getconfig alltets", getconfig.all());

  if (!getconfig) {
    logger.warn(
      `Configuration is missing. Please run ${chalk.green(
        "init"
      )} to add a dub.co credentials.`
    );
    process.exit(0);
  }

  const configInfo: ConfigTypes = getconfig.all();

  console.log("configInfo", configInfo);

  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${configInfo.authToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      domain: configInfo.domain,
      url: url,
      key: shortLink
    })
  };

  try {
    const response = await fetch(
      `https://api.dub.co/links?projectSlug=${configInfo?.projectSlug}`,
      options
    );

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    const data = (await response.json()) as APIResponse;
    return `https://${data?.domain}/${data?.key}`;
  } catch (error) {
    handleError(error);
  }
}
