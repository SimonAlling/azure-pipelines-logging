import { command } from "azure-pipelines-logging";

console.log(
    command("task", "logissue", { type: "error" }) // A function, not a string!
);

/*
Output:
[Function (anonymous)]
*/
