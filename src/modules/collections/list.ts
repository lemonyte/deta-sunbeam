import type { List, Listitem } from "sunbeam-types";
import { commands, fetchSpace } from "../../utils";
import type { Collection, CollectionsResponse } from "../../types";

async function main(): Promise<List> {
  const data = await fetchSpace<CollectionsResponse>("collections");

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
    items: data.collections.map((c) => collection(c)),
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
        command: {
          args: commands.collections.view.split(" "),
          input: JSON.stringify(collection),
        },
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
        command: {
          args: commands.collections.key.split(" "),
          input: JSON.stringify(collection),
        },
        key: "k",
        onSuccess: "push",
      },
    ],
  };
}

main().then((output) => {
  console.log(JSON.stringify(output));
});
