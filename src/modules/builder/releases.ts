import type { List, Listitem } from "sunbeam-types";
import { fetchSpace, getInput } from "../../utils";
import type { Project, Release, ReleasesResponse } from "../../types";

async function main(): Promise<List> {
  const project = getInput<Project>();
  const data = await fetchSpace<ReleasesResponse>(`releases?app_id=${project.id}`);
  const releases = data.releases.sort((a, b) => new Date(b.released_at).getTime() - new Date(a.released_at).getTime());

  return {
    type: "list",
    title: project.name,
    emptyView: {
      text: "No releases found.",
      actions: [
        {
          type: "reload",
          title: "Reload",
          key: "r",
        },
      ],
    },
    items: releases.map((r) => release(r)),
  };
}

function release(release: Release): Listitem {
  const accessories = [];
  if (release.latest) {
    accessories.push("Latest");
  }

  if (release.discovery.listed) {
    accessories.push("Listed");
  }

  accessories.push(new Date(release.released_at).toString());

  return {
    title: release.name,
    id: release.id,
    subtitle: release.version,
    accessories,
    actions: [
      {
        type: "open",
        title: "Open in Discovery",
        target: release.discovery.canonical_url,
      },
      {
        type: "copy",
        title: "Copy Discovery URL",
        text: release.discovery.canonical_url,
        key: ".",
      },
    ],
  };
}

main().then((output) => {
  console.log(JSON.stringify(output));
});
