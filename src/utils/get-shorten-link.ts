import { APIResponse, LinkOptions } from "@/types";
import fetch from "node-fetch";

export async function getShortLink({ url, shortLink, config }: LinkOptions) {
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      domain: config.domain.slug,
      url: url,
      key: shortLink
    })
  };

  try {
    const response = await fetch(
      `https://api.dub.co/links?projectSlug=${config.project.slug}`,
      options
    );

    if (response.status === 404) {
      throw new Error(
        "Project not found. Please create a new project on https://dub.co and try logging in again."
      );
    }
    const data = (await response.json()) as APIResponse;
    return `https://${data?.domain}/${data?.key}`;
  } catch (error) {
    throw new Error(`${error}`);
  }
}
