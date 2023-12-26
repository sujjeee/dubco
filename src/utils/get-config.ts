import { DubConfig } from "@/types";
import Configstore from "configstore";

export async function getConfig() {
  const getConfig = new Configstore("dubco");

  if (!getConfig.size) {
    throw new Error("Missing configuration. Please try logging in again.");
  }

  const config = (await getConfig.all) as DubConfig;

  return config;
}
