import type { List, Listitem } from "sunbeam-types";
import { command, fetchSpace } from "../../utils";
import type { Collection } from "../../types";

export async function list(): Promise<List> {
  const { collections } = await fetchSpace<{ collections: Collection[] }>("collections");

  return {
    type: "list",
    title: "Collections",
    emptyView: {
      text: "No Collections found.",
      actions: [
        {
          type: "reload",
          title: "Reload",
          key: "r",
        },
      ],
    },
    items: collections.map((c) => collection(c)),
  };
}

function collection(collection: Collection): Listitem {
  const accessories = [];

  if (collection.migrated) {
    accessories.push("Migrated");
  }

  accessories.push(new Date(collection.created_at).toString());

  return {
    title: collection.name,
    id: collection.id,
    subtitle: collection.id,
    accessories,
    actions: [
      {
        type: "run",
        title: "View Collection",
        command: command("collections", "view", collection.id),
        onSuccess: "push",
      },
      {
        type: "open",
        title: "Open in browser",
        target: `https://deta.space/collections/${collection.id}`,
        key: "o",
      },
      {
        type: "copy",
        title: "Copy URL",
        text: `https://deta.space/collections/${collection.id}`,
        key: ".",
      },
      {
        type: "run",
        title: "Generate Data Key",
        command: command("collections", "key", collection.id),
        key: "k",
        onSuccess: "push",
      },
    ],
  };
}
