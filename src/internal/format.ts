export type FormatWithMessage = "command" | "debug" | "error" | "group" | "warning";

export type FormatWithoutMessage = "endgroup";

// https://docs.microsoft.com/en-us/azure/devops/pipelines/scripts/logging-commands#formatting-commands
export type Format = FormatWithMessage | FormatWithoutMessage;
