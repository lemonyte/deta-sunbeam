import type { List, Listitem } from "sunbeam-types";
import { fetchSpace, getSpaceAppID } from "../../utils.ts";
import type { Project, Revision } from "../../types.ts";

export async function revisions(args: string[]): Promise<List> {
  const id = args[0] ?? getSpaceAppID();

  if (!id) {
    throw new Error("Expected 1 argument 'id'.");
  }

  const project = await fetchSpace<Project>(`apps/${id}`);
  const data = await fetchSpace<{ revisions: Revision[] }>(
    `apps/${project.id}/revisions?per_page=999`,
  );
  const revisions = data.revisions.sort((a, b) =>
    new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );

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
