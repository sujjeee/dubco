import type { UserInfo } from "@/types";
import fetch from "node-fetch";

export async function getUserInfo({ token }: { token: string }) {
  try {
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    };

    const response = await fetch("https://api.dub.co/me", options);
    const parsedData = (await response.json()) as UserInfo;

    return parsedData;
  } catch (error) {
    throw new Error("Failed to fetch user credentials.");
  }
}
