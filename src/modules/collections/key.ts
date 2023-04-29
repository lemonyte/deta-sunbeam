import { command, fetchSpace, postSpace } from "../../utils";
import type { Collection, CreateKeyResponse } from "../../types";

export async function key(args: string[]) {
  const collection = await fetchSpace<Collection>(`collections/${args[0]}`);
  console.log(collection); // temp
  generate(args); // temp

  return {
    type: "form",
    title: "Generate Key",
    submitAction: {
      type: "run",
      title: "Generate key",
      command: command("collections", "key", "generate", "${input:name}"),
      inputs: {
        name: "name",
        title: "Name",
        type: "textfield",
        placeholder: "key name",
      },
      onSuccess: "push",
    },
  };
}

async function generate(args: string[]) {
  const collection = await fetchSpace<Collection>(`collections/${args[0]}`);
  const name = process.argv.pop();

  if (!name) {
    throw new Error("Name is required");
  }

  let text;
  const actions = [];

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
    actions.push({
      type: "run",
      title: "Retry",
      command: command("collections", "key"),
      onSuccess: "push",
    });
  }

  return {
    type: "detail",
    title: "Generate Key",
    preview: text,
    actions,
  };
}

// console.log(process.argv);

// if (process.argv[process.argv.length - 2] === "generate") {
//   generate().then((output) => {
//     console.log(JSON.stringify(output));
//   });
// } else {
//   main().then((output) => {
//     console.log(JSON.stringify(output));
//   });
// }
