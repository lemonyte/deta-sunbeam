import { commands, fetchSpace, getInstanceMap } from "../utils";
import type { CanvasItem, CanvasResponse, Instance } from "../types";

async function main() {
  const systemApps: Record<string, object> = {
    discovery: await discovery(),
    docs: docs(),
    builder: builder(),
    collections: collections(),
    manual: manual(),
  };

  const canvas = await fetchSpace<CanvasResponse>("canvas?limit=999");
  const instanceMap = await getInstanceMap();

  function getInstance(item: CanvasItem) {
    if (item.item_type === "system_app") {
      return systemApps[item.item_id];
    }

    const i = instanceMap[item.item_id];

    if (!i) {
      return null;
    }

    return instance(i);
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
    items: canvas.items.map((item) => getInstance(item)).filter((item) => item),
  };
}

function instance(instance: Instance) {
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

async function discovery() {
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
      }
    ],
  };
}

function builder() {
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
      }
    ],
  };
}

function collections() {
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
      }
    ],
  };
}

function docs() {
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
      }
    ],
  };
}

function manual() {
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
