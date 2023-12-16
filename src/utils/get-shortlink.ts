import { APIResponse, LinkOptions } from "@/src/types";
import { getConfigInfo } from "@/src/utils/get-config-info";
import fetch from "node-fetch";

export async function getShortLink({ url, shortLink }: LinkOptions) {
  const configInfo = getConfigInfo();

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

    const data = (await response.json()) as APIResponse;
    return `https://${data?.domain}/${data?.key}`;
  } catch (error) {
    throw new Error(`${error}`);
  }
}
