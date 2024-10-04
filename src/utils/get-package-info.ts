import packageJson from "package-json"
import type { PackageJson } from "type-fest"

export async function getPackageInfo() {
  // TODO: after publish update the package name
  const packageInfo = await packageJson("dubco")
  return packageInfo as PackageJson
}
