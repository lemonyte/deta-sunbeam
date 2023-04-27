import type { Action, List, Listitem } from "sunbeam-types";
import { commands, fetchSpace, getInstanceMap } from "../../utils";
import type { Instance, Project, ProjectsResponse } from "../../types";

async function main(): Promise<List> {
  const projects = await fetchSpace<ProjectsResponse>("apps");
  const instanceMap = await getInstanceMap();

  return {
    type: "list",
    title: "Builder",
    emptyView: {
      text: "No projects found.",
      actions: [
        {
          type: "reload",
          title: "Reload",
          key: "r",
        },
      ],
    },
    items: projects.apps.map((p) => project(p, instanceMap[p.id])),
  };
}

function project(project: Project, instance?: Instance): Listitem {
  const actions: Action[] = [
    {
      type: "open",
      title: "Open in Builder",
      target: `https://deta.space/builder/${project.id}`,
    },
  ];

  if (instance) {
    actions.push({
      type: "open",
      title: "Open Builder instance",
      target: instance.url,
      key: "o",
    });
  }

  actions.push({
    type: "run",
    title: "View builds",
    key: "b",
    command: {
      args: commands.builder.builds.split(" "),
      input: JSON.stringify(project),
    },
    onSuccess: "push",
  });

  actions.push({
    type: "run",
    title: "View revisions",
    key: "v",
    command: {
      args: commands.builder.revisions.split(" "),
      input: JSON.stringify(project),
    },
    onSuccess: "push",
  });

  actions.push({
    type: "run",
    title: "View releases",
    key: "l",
    command: {
      args: commands.builder.releases.split(" "),
      input: JSON.stringify(project),
    },
    onSuccess: "push",
  });

  actions.push({
    type: "copy",
    title: "Copy Builder URL",
    key: ".",
    text: `https://deta.space/builder/${project.id}`,
  });

  if (instance) {
    actions.push({
      type: "copy",
      title: "Copy instance URL",
      key: ",",
      text: instance.url,
    });
  }

  actions.push({
    type: "copy",
    title: "Copy project ID",
    key: "i",
    text: project.id,
  });

  return {
    title: project.name,
    id: project.id,
    subtitle: project.id,
    accessories: [project.status],
    actions,
  };
}

main().then((output) => {
  console.log(JSON.stringify(output));
});
