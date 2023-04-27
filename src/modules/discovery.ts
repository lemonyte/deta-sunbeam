import { fetchSpace } from "../utils";
import type { Release, ReleasesResponse } from "../types";

async function main() {
  const data = await fetchSpace<ReleasesResponse>("discovery/apps");
  const releases = data.releases.sort((a, b) => b.discovery.stats.total_installs - a.discovery.stats.total_installs);

  return {
    type: "list",
    title: "Discovery",
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
    items: releases.map((r) => release(r)),
  };
}

function release(release: Release) {
  const actions: object[] = [
    {
      type: "open",
      title: "Open in Discovery",
      target: release.discovery.listed_url,
    },
    {
      type: "copy",
      title: "Copy Discovery URL",
      text: release.discovery.listed_url,
      key: ".",
    },
  ];

  if (release.discovery.homepage) {
    actions.push({
      type: "open",
      title: "Open homepage",
      target: release.discovery.homepage,
      key: "h",
    });
    actions.push({
      type: "copy",
      title: "Copy homepage URL",
      text: release.discovery.homepage,
      key: ",",
    });
  }

  if (release.discovery.git) {
    actions.push({
      type: "open",
      title: "Open Git repository",
      target: release.discovery.git,
      key: "g",
    });
    actions.push({
      type: "copy",
      title: "Copy Git repository URL",
      text: release.discovery.git,
      key: "/",
    });
  }

  return {
    title: release.discovery.title || release.app_name,
    accessories: [`${release.discovery.stats.total_installs} installs`],
    actions,
  };
}

main().then((output) => {
  console.log(JSON.stringify(output));
});
