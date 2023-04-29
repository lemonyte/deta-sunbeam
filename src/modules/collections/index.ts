import { list } from "./list";
import { view } from "./view";
import { key } from "./key";

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
