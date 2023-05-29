import type { List, Listitem } from "sunbeam-types";
import { command, fetchSpace } from "../../utils.ts";
import type { Collection } from "../../types.ts";

export async function list(): Promise<List> {
  const { collections } = await fetchSpace<{ collections: Collection[] }>(
    "collections",
  );

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
        type: "push",
        title: "View Collection",
        page: { command: command("collections", "view", collection.id) },
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
        type: "push",
        title: "Generate data key",
        page: {
          command: command(
            "collections",
            "key",
            collection.id,
            "${input:name}",
          ),
        },
        inputs: [
          {
            name: "name",
            title: "Name",
            type: "textfield",
            placeholder: "key name",
          },
        ],
        key: "k",
      },
    ],
  };
}
