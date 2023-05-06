import { list } from "./list.ts";
import { view } from "./view.ts";
import { key } from "./key.ts";

export async function collections(args: string[]) {
  switch (args[0]) {
    case "list":
      return await list();

    case "view":
      return await view(args.slice(1));

    case "key":
      return await key(args.slice(1));

    default:
      return await list();
  }
}
