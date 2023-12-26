import type { CreatedDomain, CreatedProject, Domain, Project } from "@/types";
import fetch from "node-fetch";

export async function getProjectsInfo({ token }: { token: string }) {
  try {
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    };

    const response = await fetch("https://api.dub.co/projects", options);
    const parsedData = (await response.json()) as Project[];

    if (parsedData.length === 0) {
      return null;
    }
    return parsedData;
  } catch (error) {
    throw new Error(`${error}`);
  }
}

export async function getDomainsInfo({
  token,
  projectSlug
}: {
  token: string;
  projectSlug: string;
}) {
  try {
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    };

    const response = await fetch(
      `https://api.dub.co/projects/${projectSlug}/domains`,
      options
    );

    if (response.status === 404) {
      throw new Error(
        "Project not found. Please create a new project on https://dub.co and try logging in again."
      );
    }
    const parsedData = (await response.json()) as Domain[];

    return parsedData;
  } catch (error) {
    throw new Error(`${error}`);
  }
}

export async function createProject({
  name,
  slug,
  domain,
  token
}: {
  name: string;
  slug: string;
  domain: string;
  token: string;
}) {
  try {
    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        slug,
        domain
      })
    };

    const response = await fetch("https://api.dub.co/projects/", options);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const parsedData = (await response.json()) as [
      CreatedProject,
      CreatedDomain
    ];
    return parsedData;
  } catch (error) {
    throw new Error(`${error}`);
  }
}
