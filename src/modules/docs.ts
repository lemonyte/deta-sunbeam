import type { List, Listitem } from "sunbeam-types";
import { fetchSpace } from "../utils.ts";
import type { SearchHit, SearchResponse, SearchResult } from "../types.ts";

export async function docs(args: string[]): Promise<List> {
  const data = await fetchResults(args[0]);

  return {
    type: "list",
    title: "Docs",
    emptyView: {
      text: "No results found.",
      actions: [
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

function searchResult(result: SearchResult): Listitem {
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

  const data = await fetchSpace<SearchResponse>(
    `indexes/docs/search?q=${encodeURIComponent(query)}&limit=999`,
  );

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
