import { command, format, log } from "azure-pipelines-logging";

log(command("task", "logissue", { type: "error" })("Error summary"));
log(format("error")(
    "Details about error.",
    "Second line of details.",
    "Third line.",
));

/*
Output:
##vso[task.logissue type=error;]Error summary
##[error]Details about error.
##[error]Second line of details.
##[error]Third line.
*/
