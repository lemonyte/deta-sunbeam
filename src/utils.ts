import { homedir } from "node:os";
import { SpaceClient } from "deta-space-client";
import type { Instance } from "./types.ts";

const spaceClient = SpaceClient(await getSpaceToken());

export function command(...args: string[]): [string, ...string[]] {
  return [Deno.execPath(), "run", "--allow-all", Deno.mainModule, ...args];
}

export async function getSpaceToken(): Promise<string> {
  try {
    return JSON.parse(await Deno.readTextFile(`${homedir()}/.detaspace/space_tokens`)).access_token;
  } catch {
    throw Error("Could not find or parse your Space token. Please install and authenticate the Space CLI.");
  }
}

export function getSpaceAppID(): string | null {
  try {
    return JSON.parse(Deno.readTextFileSync("./.space/meta")).id;
  } catch {
    return null;
  }
}

export function fetchSpace<Type>(endpoint: string) {
  return spaceClient.get<Type>(endpoint);
}

export function postSpace<Type>(endpoint: string, body: unknown) {
  return spaceClient.post<Type>(endpoint, body);
}

export async function getInstanceMap() {
  const { instances } = await fetchSpace<{ instances: Instance[] }>("instances");

  return instances.reduce((acc, instance) => {
    acc[instance.id] = instance;
    return acc;
  }, {} as Record<string, Instance>);
}
