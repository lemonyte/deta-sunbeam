import type { List, Listitem } from "sunbeam-types";
import { fetchSpace, getInput } from "../../utils";
import type { Project, Revision, RevisionsResponse } from "../../types";

async function main(): Promise<List> {
  const project = getInput<Project>();
  const data = await fetchSpace<RevisionsResponse>(`apps/${project.id}/revisions`);
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
  };
}

main().then((output) => {
  console.log(JSON.stringify(output));
});
