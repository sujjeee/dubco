import type { GetDomain } from "@/types"
import { getConfig } from "@/utils/get-config"
import { parseApiResponse } from "@/utils/parser"
import fetch from "node-fetch"

export async function getDomains() {
  const config = await getConfig()

  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${config.key}`,
      "Content-Type": "application/json"
    }
  }

  const response = await fetch("https://api.dub.co/domains", options)
  return await parseApiResponse<GetDomain[]>(response)
}

export async function createDomain(slug: string) {
  const config = await getConfig()

  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.key}l`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      slug: slug
    })
  }

  const response = await fetch("https://api.dub.co/domains", options)
  return await parseApiResponse<GetDomain[]>(response)
}

interface UpdateDomainProps {
  oldSlug: string
  newSlug: string
}

export async function updateDomain({ newSlug, oldSlug }: UpdateDomainProps) {
  const config = await getConfig()

  const options = {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${config.key}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      slug: newSlug
    })
  }

  const response = await fetch(`https://api.dub.co/domains/${oldSlug}`, options)

  const parsedResponse = await parseApiResponse<GetDomain[]>(response)

  return parsedResponse
}

export async function deleteDomain(slug: string) {
  const config = await getConfig()

  const options = {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${config.key}`
    }
  }

  const response = await fetch(`https://api.dub.co/domains/${slug}`, options)
  return await parseApiResponse<GetDomain["id"]>(response)
}
