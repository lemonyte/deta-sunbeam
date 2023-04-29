import type { List, Listitem } from "sunbeam-types";
import { fetchSpace } from "../../utils";
import type { Project, Revision } from "../../types";

export async function revisions(args: string[]): Promise<List> {
  if (args.length !== 1) {
    throw new Error("Expected 1 argument.");
  }

  const project = await fetchSpace<Project>(`apps/${args[0]}`);
  const data = await fetchSpace<{ revisions: Revision[] }>(`apps/${project.id}/revisions`);
  const revisions = data.revisions.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

  return {
    type: "list",
    title: project.name,
    emptyView: {
      text: "No revisions found.",
      actions: [
        {
          type: "reload",
          title: "Reload",
          key: "r",
        },
      ],
    },
    items: revisions.map((r) => revision(r)),
  };
}

function revision(revision: Revision): Listitem {
  return {
    title: revision.tag,
    id: revision.id,
    subtitle: revision.id,
    accessories: [new Date(revision.created_at).toString()],
    actions: [
      {
        type: "copy",
        title: "Copy tag",
        text: revision.tag,
      },
    ],
  };
}
