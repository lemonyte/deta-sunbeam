import type { List, Listitem } from "sunbeam-types";
import { fetchSpace } from "../../utils";
import type { Collection, Base, Drive } from "../../types";

export async function view(args: string[]): Promise<List> {
  if (args.length !== 1) {
    throw new Error("Expected 1 argument.");
  }

  const collection = await fetchSpace<Collection>(`collections/${args[0]}`);
  const { bases } = await fetchSpace<{ bases: Base[] }>(`collections/${collection.id}/bases`);
  const { drives } = await fetchSpace<{ drives: Drive[] }>(`collections/${collection.id}/drives`);

  return {
    type: "list",
    title: collection.name,
    emptyView: {
      text: "No Bases or Drives found.",
      actions: [
        {
          type: "reload",
          title: "Reload",
          key: "r",
        },
      ],
    },
    items: [...bases.map((b) => base(b)), ...drives.map((d) => drive(d))],
  };
}

function base(base: Base): Listitem {
  return {
    title: base.name,
    id: base.name,
    accessories: [base.status, "Base"],
    actions: [
      {
        type: "copy",
        title: "Copy name",
        text: base.name,
      },
    ],
  };
}

function drive(drive: Drive): Listitem {
  return {
    title: drive.name,
    id: drive.name,
    accessories: [drive.status, "Drive"],
    actions: [
      {
        type: "copy",
        title: "Copy name",
        text: drive.name,
      },
    ],
  };
}
