import { canvas } from "./modules/canvas.ts";
import { discovery } from "./modules/discovery.ts";
import { docs } from "./modules/docs.ts";
import { builder } from "./modules/builder/index.ts";
import { collections } from "./modules/collections/index.ts";

async function index(args: string[]) {
  switch (args[0]) {
    case "canvas":
      return await canvas();

    case "discovery":
      return await discovery();

    case "docs":
      return await docs(args.slice(1));

    case "builder":
      return await builder(args.slice(1));

    case "collections":
      return await collections(args.slice(1));

    default:
      return await canvas();
  }
}

index(Deno.args.slice(2)).then((output) => {
  console.log(JSON.stringify(output));
});
