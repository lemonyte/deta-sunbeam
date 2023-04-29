import { readFileSync } from "fs";
import { homedir } from "os";
import { SpaceClient } from "deta-space-client";
import type { Instance } from "./types";

const spaceClient = SpaceClient(getSpaceToken());

export function command(...args: string[]): [string, ...string[]] {
  return [process.argv[0], process.argv[1], ...args];
}

export function getSpaceToken(): string {
  try {
    return JSON.parse(readFileSync(`${homedir()}/.detaspace/space_tokens`, { encoding: "utf-8" })).access_token;
  } catch {
    throw Error("Could not find or parse your Space token. Please install and authenticate the Space CLI.");
  }
}

export function getSpaceAppID(): string | null {
  try {
    return JSON.parse(readFileSync("./.space/meta", { encoding: "utf-8" })).id;
  } catch {
    return null;
  }
}

export function fetchSpace<Type>(endpoint: string) {
  return spaceClient.get<Type>(endpoint);
}

export function postSpace<Type>(endpoint: string, body: any) {
  return spaceClient.post<Type>(endpoint, body);
}

export async function getInstanceMap() {
  const { instances } = await fetchSpace<{ instances: Instance[] }>("instances");

  return instances.reduce((acc, instance) => {
    acc[instance.id] = instance;
    return acc;
  }, {} as Record<string, Instance>);
}
