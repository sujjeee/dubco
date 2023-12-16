#!/usr/bin/env node

import { init } from "@/src/commands/init";
import { getPackageInfo } from "@/src/utils/get-package-info";
import { Command } from "commander";

process.on("SIGINT", () => process.exit(0));
process.on("SIGTERM", () => process.exit(0));

function main() {
  const packageInfo = getPackageInfo();

  const program = new Command()
    .name("dubco")
    .description("A CLI for shortening url.")
    .version(
      packageInfo.version || "1.0.0",
      "-v, --version",
      "display the version number"
    );

  program.addCommand(init);

  program.parse();
}

main();
