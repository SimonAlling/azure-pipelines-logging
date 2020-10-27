export type FormatWithSingleLineMessage = "command" | "group";

export type FormatWithMultiLineMessage = "debug" | "error" | "warning";

export type FormatWithoutMessage = "endgroup";

// https://docs.microsoft.com/en-us/azure/devops/pipelines/scripts/logging-commands#formatting-commands
export type Format = FormatWithSingleLineMessage | FormatWithMultiLineMessage | FormatWithoutMessage;
