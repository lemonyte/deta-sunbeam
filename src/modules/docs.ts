import { commands, fetchSpace, getInputObject } from "../utils";
import type { SearchHit, SearchResponse, SearchResult } from "../types";

async function main() {
  const data = await fetchResults(getInputObject<string>(""));

  return {
    type: "list",
    title: "Docs",
    emptyView: {
      text: "No results found.",
      actions: [
        {
          type: "run",
          title: "Search",
          inputs: [
            {
              name: "query",
              title: "Search",
              type: "textfield",
              placeholder: "query",
            },
          ],
          command: {
            args: commands.docs.split(" "),
            input: "${input:query}",
          },
          onSuccess: "push",
        },
        {
          type: "reload",
          title: "Reload",
          key: "r",
        },
        {
          type: "open",
          title: "Open in Browser",
          target: "https://docs.deta.sh",
          key: "o",
        },
      ],
    },
    items: data.map((result) => searchResult(result)),
  };
}

function searchResult(result: SearchResult) {
  return {
    title: result.title,
    id: result.id,
    subtitle: result.section,
    actions: [
      {
        type: "open",
        title: "Open in browser",
        target: result.url,
      },
      {
        type: "copy",
        title: "Copy URL",
        text: result.url,
        key: ".",
      },
    ],
  };
}

async function fetchResults(query: string) {
  const results: SearchResult[] = [];

  if (!query) {
    return results;
  }

  const data = await fetchSpace<SearchResponse>(`indexes/docs/search?q=${encodeURIComponent(query)}`);

  for (const hit of data.hits) {
    const parts: string[] = [];
    for (let i = 0; i < 7; i++) {
      if (!hit[`hierarchy_lvl${i}` as keyof SearchHit]) {
        break;
      }

      parts.push(hit[`hierarchy_lvl${i}` as keyof SearchHit]);
    }

    const section = parts.slice(0, -1).join(" > ");
    const title = parts[parts.length - 1];
    const url = new URL(hit.url);
    url.protocol = "https:";
    url.host = "deta.space";
    url.port = "";

    if (!results.find((r) => r.title === title && r.section === section)) {
      results.push({
        id: hit.objectID,
        section,
        title,
        parts,
        url: url.toString(),
      });
    }
  }

  return results;
}

main().then((output) => {
  console.log(JSON.stringify(output));
});
