import { canvas } from "./modules/canvas";
import { discovery } from "./modules/discovery";
import { docs } from "./modules/docs";
import { builder } from "./modules/builder";
import { collections } from "./modules/collections";

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

index(process.argv.slice(2)).then((output) => {
  console.log(JSON.stringify(output));
});
