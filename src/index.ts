import flatMap from "array.prototype.flatmap"; // Necessary for Node 10 support (ES2018).

import {
    Action,
    Area,
    NoProperties,
    Properties,
    serializeProperties,
} from "./internal/command";
import {
    Format,
    FormatWithMessage,
    FormatWithoutMessage,
} from "./internal/format";

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
 *
 * Can be partially applied – these are equivalent:
 *
 *     log(format("error", "Ouch!"))
 *     log(format("error")("Ouch!"))
 */
export function format(format: FormatWithoutMessage): string;
export function format(format: FormatWithMessage): (...message: readonly string[]) => string; // Only one argument passed ⇒ return a function.
export function format(format: FormatWithMessage, ...message: readonly string[]): string; // More than one argument passed ⇒ return a string.
export function format(format: Format, ...message: readonly string[]): string | ((...message: readonly string[]) => string) {
    const serialize = (...message: readonly string[]) => (
        // Arguments are conceptually treated as lines, but since they themselves can contain line breaks, we first split each argument into lines.
        (message.length === 0 ? [""] : flatMap(message, arg => arg.split("\n")))
        .map(line => `##[${format}]${line}`)
        .join("\n")
    );
    return message.length > 0 ? serialize(...message) : serialize;
}

/**
 * Logs a command constructed by `format` or `command`.
 */
export function log(message: string): void {
    console.log(message);
}
