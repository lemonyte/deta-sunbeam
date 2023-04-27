import type { List, Listitem } from "sunbeam-types";
import { fetchSpace, getInputObject } from "../../utils";
import type { Collection, Base, Drive, BasesResponse, DrivesResponse } from "../../types";

async function main(): Promise<List> {
  const collection = getInputObject<Collection>();
  const { bases } = await fetchSpace<BasesResponse>(`collections/${collection.id}/bases`);
  const { drives } = await fetchSpace<DrivesResponse>(`collections/${collection.id}/drives`);

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

main().then((output) => {
  console.log(JSON.stringify(output));
});
