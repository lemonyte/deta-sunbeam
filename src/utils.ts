import { readFileSync } from "fs";
import { homedir } from "os";
import { SpaceClient } from "deta-space-client";
import type { InstancesResponse, Instance } from "./types";

const spaceClient = SpaceClient(getSpaceToken());

export const commands = {
  canvas: "node ./dist/src/modules/canvas.js",
  discovery: "node ./dist/src/modules/discovery.js",
  docs: "node ./dist/src/modules/docs.js",
  collections: {
    list: "node ./dist/src/modules/collections/list.js",
    view: "node ./dist/src/modules/collections/view.js",
    key: "node ./dist/src/modules/collections/key.js",
  },
  builder: {
    projects: "node ./dist/src/modules/builder/projects.js",
    builds: "node ./dist/src/modules/builder/builds.js",
    revisions: "node ./dist/src/modules/builder/revisions.js",
    releases: "node ./dist/src/modules/builder/releases.js",
  },
};

export function getInputObject<Type>(defaultValue?: any): Type {
  let input;
  try {
    input = readFileSync(process.stdin.fd, { encoding: "utf-8" });
  } catch {
    return (defaultValue !== undefined ? defaultValue : null) as Type;
  }

  if (input === null) {
    return (defaultValue !== undefined ? defaultValue : null) as Type;
  }

  try {
    return JSON.parse(input);
  } catch {
    return input as Type;
  }
}

export function getSpaceToken(): string {
  return JSON.parse(readFileSync(`${homedir()}/.detaspace/space_tokens`, { encoding: "utf8" })).access_token;
}

export function fetchSpace<Type>(endpoint: string) {
  return spaceClient.get<Type>(endpoint);
}

export function postSpace<Type>(endpoint: string, body: any) {
  return spaceClient.post<Type>(endpoint, body);
}

export async function getInstanceMap() {
  const instances = (await fetchSpace<InstancesResponse>("instances")).instances;

  return instances.reduce((acc, instance) => {
    acc[instance.id] = instance;
    return acc;
  }, {} as Record<string, Instance>);
}
