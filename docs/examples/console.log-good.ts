import { command } from "azure-pipelines-logging";

console.log(
    command("task", "logissue", { type: "error" })("Error summary")
);

/*
Output:
##vso[task.logissue type=error;]Error summary
*/
