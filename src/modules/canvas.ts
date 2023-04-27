import type { List, Listitem } from "sunbeam-types";
import { commands, fetchSpace, getInstanceMap } from "../utils";
import type { CanvasResponse, Instance } from "../types";

async function main(): Promise<List> {
  const systemApps: Record<string, Listitem> = {
    discovery: discovery(),
    docs: docs(),
    builder: builder(),
    collections: collections(),
    manual: manual(),
  };

  const canvas = await fetchSpace<CanvasResponse>("canvas?limit=999");
  const instanceMap = await getInstanceMap();
  const items: Listitem[] = [];

  for (const item of canvas.items) {
    items.push(item.item_type === "system_app" ? systemApps[item.item_id] : instance(instanceMap[item.item_id]));
  }

  return {
    type: "list",
    title: "Canvas",
    emptyView: {
      text: "No apps found.",
      actions: [
        {
          type: "reload",
          title: "Reload",
          key: "r",
        },
      ],
    },
    items,
  };
}

function instance(instance: Instance): Listitem {
  return {
    title: instance.release.app_name,
    id: instance.id,
    actions: [
      {
        type: "open",
        title: "Open in browser",
        target: instance.url,
      },
      {
        type: "open",
        title: "Open in Discovery",
        target: `https://deta.space/discovery/r/${instance.release.id}`,
        key: "d",
      },
      {
        type: "copy",
        title: "Copy URL",
        text: instance.url,
        key: ".",
      },
      {
        type: "copy",
        title: "Copy Discovery URL",
        text: `https://deta.space/discovery/r/${instance.release.id}`,
        key: ",",
      },
    ],
  };
}

function discovery(): Listitem {
  return {
    title: "Discovery",
    actions: [
      {
        type: "run",
        title: "Search Discovery",
        command: commands.discovery,
        onSuccess: "push",
      },
      {
        type: "open",
        title: "Open in browser",
        target: "https://deta.space/discovery",
        key: "o",
      },
      {
        type: "copy",
        title: "Copy URL",
        text: "https://deta.space/discovery",
        key: ".",
      },
    ],
  };
}

function builder(): Listitem {
  return {
    title: "Builder",
    actions: [
      {
        type: "run",
        title: "View projects",
        command: commands.builder.projects,
        onSuccess: "push",
      },
      {
        type: "open",
        title: "Open in browser",
        target: "https://deta.space/builder",
        key: "o",
      },
      {
        type: "copy",
        title: "Copy URL",
        text: "https://deta.space/builder",
        key: ".",
      },
    ],
  };
}

function collections(): Listitem {
  return {
    title: "Collections",
    actions: [
      {
        type: "run",
        title: "Search Collections",
        command: commands.collections.list,
        onSuccess: "push",
      },
      {
        type: "open",
        title: "Open in browser",
        target: "https://deta.space/collections",
        key: "o",
      },
      {
        type: "copy",
        title: "Copy URL",
        text: "https://deta.space/collections",
        key: ".",
      },
    ],
  };
}

function docs(): Listitem {
  return {
    title: "Docs",
    actions: [
      {
        type: "run",
        title: "Search docs",
        command: commands.docs,
        onSuccess: "push",
      },
      {
        type: "open",
        title: "Open in browser",
        target: "https://deta.space/docs",
        key: "o",
      },
      {
        type: "copy",
        title: "Copy URL",
        text: "https://deta.space/docs",
        key: ".",
      },
    ],
  };
}

function manual(): Listitem {
  return {
    title: "Manual",
    actions: [
      {
        type: "open",
        title: "Open in browser",
        target: "https://deta.space/manual",
      },
      {
        type: "copy",
        title: "Copy URL",
        text: "https://deta.space/manual",
        key: ".",
      },
    ],
  };
}

main().then((output) => {
  console.log(JSON.stringify(output));
});
