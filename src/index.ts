import {
    Action,
    Area,
    NoProperties,
    Properties,
    serializeProperties,
} from "./internal/command";
import {
    Format,
    FormatWithSingleLineMessage,
    FormatWithMultiLineMessage,
    FormatWithoutMessage,
} from "./internal/format";
import {
    NonEmptyArray,
} from "./internal/utilities";

/**
 * Constructs a general log command.
 */
export function command<
    Ar extends Area,
    Ac extends Action<Ar>,
    Props extends Properties<Ar, Ac>,
>(
    area: Ar,
    action: Ac,
    /*
    It is non-trivial to type this function in a good way, in particular the `properties` parameter.
    For example, with `...properties` or `...[properties]`, the parameter is referred to in autocompletion as `properties_0` or `__2_0`, respectively.
    And if one tries to make it an optional non-rest parameter, one tends to end up with either unhelpful autocompletion or cryptic type error messages.
    */
    ...properties: Props extends NoProperties ? [] : [Props]
): (
    message: string,
) => string {
    const propsString = properties.length === 0 ? "" : serializeProperties<Ar, Ac>(properties[0] as Props);
    const maybeSpace = propsString.length === 0 ? "" : " ";
    return message => `##vso[${area}.${action}${maybeSpace}${propsString}]${message}`;
}

/**
 * Constructs a formatting log command representing an error, warning, collapsible section etc.
 */
export function format(format: FormatWithoutMessage): () => string;
export function format(format: FormatWithSingleLineMessage): (message: string) => string;
export function format(format: FormatWithMultiLineMessage): (...message: NonEmptyArray<string>) => string;
export function format(format: Format): (...message: readonly string[]) => string {
    return (...message) => (
        (message.length === 0 ? [""] : message) // The empty list represents the FormatWithoutMessage case.
        .map(line => `##[${format}]${line}`)
        .join("\n")
    );
}

/**
 * Logs a command constructed by `format` or `command`.
 */
export function log(message: string): void {
    console.log(message);
}
