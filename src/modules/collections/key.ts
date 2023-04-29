import type { Action, Detail } from "sunbeam-types";
import { fetchSpace, postSpace } from "../../utils";
import type { Collection, CreateKeyResponse } from "../../types";

export async function key(args: string[]): Promise<Detail> {
  if (args.length !== 2) {
    throw new Error("Expected 2 arguments 'id', 'name'.");
  }

  const collection = await fetchSpace<Collection>(`collections/${args[0]}`);
  const name = args[1];
  const actions: Action[] = [];
  let text;

  try {
    const res = await postSpace<CreateKeyResponse>(`collections/${collection.id}/keys`, { name });
    text = `Key '${name}' successfully generated.`;
    actions.push({
      type: "copy",
      title: "Copy key",
      text: res.value,
    });
  } catch (err) {
    text = `Failed to generate key '${name}'. ${(err as Error).message}`;
  }

  return {
    type: "detail",
    title: "Generate Key",
    preview: { text },
    actions,
  };
}
