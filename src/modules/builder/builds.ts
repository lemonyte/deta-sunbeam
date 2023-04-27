import { fetchSpace, getInputObject } from "../../utils";
import type { Project, Build, BuildsResponse } from "../../types";

async function main() {
  const project = getInputObject<Project>();
  const data = await fetchSpace<BuildsResponse>(`builds?app_id=${project.id}`);
  const builds = data.builds.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return {
    type: "list",
    title: project.name,
    emptyView: {
      text: "No builds found.",
      actions: [
        {
          type: "reload",
          title: "Reload",
          key: "r",
        },
      ],
    },
    items: builds.map((b) => build(b)),
  };
}

function build(build: Build) {
  return {
    title: build.tag,
    id: build.id,
    subtitle: build.id,
    accessories: [build.status, new Date(build.created_at)],
  };
}

main().then((output) => {
  console.log(JSON.stringify(output));
});
