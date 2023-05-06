import type { Action, List, Listitem } from "sunbeam-types";
import { command, fetchSpace, getInstanceMap } from "../../utils.ts";
import type { Instance, Project } from "../../types.ts";

export async function projects(): Promise<List> {
  const data = await fetchSpace<{ apps: Project[] }>("apps");
  const projects = data.apps.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
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
    items: projects.map((p) => project(p, instanceMap[p.id])),
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
    type: "push",
    title: "View builds",
    key: "b",
    command: command("builder", "builds", project.id),
  });

  actions.push({
    type: "push",
    title: "View revisions",
    key: "v",
    command: command("builder", "revisions", project.id),
  });

  actions.push({
    type: "push",
    title: "View releases",
    key: "l",
    command: command("builder", "releases", project.id),
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
