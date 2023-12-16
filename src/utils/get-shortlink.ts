import { APIResponse, LinkOptions } from "@/src/types";
import { getConfigInfo } from "@/src/utils/get-config-info";
import { handleError } from "@/src/utils/handle-error";
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

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    const data = (await response.json()) as APIResponse;
    return `https://${data?.domain}/${data?.key}`;
  } catch (error) {
    handleError(error);
  }
}
