import fs from "node:fs";
import path from "path";
import type { PackageJson } from "type-fest";

export function getPackageInfo() {
  const packageJsonPath = path.join("package.json");

  return JSON.parse(fs.readFileSync(packageJsonPath, "utf-8")) as PackageJson;
}
