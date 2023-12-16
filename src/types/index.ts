#!/usr/bin/env node

export interface ConfigTypes {
  authToken: string;
  projectSlug: string;
  domain: string;
}

export interface LinkOptions {
  url: string;
  shortLink?: string;
}

export interface APIResponse {
  id: string;
  domain: string;
  key: string;
  url: string;
  archived: boolean;
  expiresAt: string;
  password: string;
  proxy: boolean;
  title: string;
  description: string;
  image: string;
  rewrite: boolean;
  ios: string;
  android: string;
  geo: Record<string, unknown>;
  publicStats: boolean;
  tagId: string;
  comments: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
  userId: string;
  projectId: string;
  clicks: number;
  lastClicked: string;
  createdAt: string;
  updatedAt: string;
}
