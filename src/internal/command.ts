type GUID = string;

type Datetime = string;

/**
 * Represents the absence of properties in a command.
 */
export type NoProperties = never;

/**
 * The `area` part in `##vso[area.action properties]message`.
 */
export type Area = keyof COMMANDS & string;

/**
 * The `action` part in `##vso[area.action properties]message`.
 */
export type Action<Ar extends Area> = keyof COMMANDS[Ar] & string;

/**
 * The `properties` part in `##vso[area.action properties]message`.
 */
export type Properties<
    Ar extends Area,
    Ac extends Action<Ar>,
> = (
    COMMANDS[Ar][Ac]
);

export type PropertyKey<
    Ar extends Area,
    Ac extends Action<Ar>,
> = (
    keyof Properties<Ar, Ac> & string
);

export type PropertyValue<
    Ar extends Area,
    Ac extends Action<Ar>,
    Key extends PropertyKey<Ar, Ac>,
> = (
    COMMANDS[Ar][Ac][Key]
);

/**
 * Describes all commands and their properties on the form `{ area: { action: { key: value }}}`.
 *
 * Reference: https://docs.microsoft.com/en-us/azure/devops/pipelines/scripts/logging-commands
 */
export type COMMANDS = {
    artifact: {
        associate: {
            artifactname: string
            type: "container" | "filepath" | "versioncontrol" | "gitref" | "tfvclabel"
        }
        upload: {
            artifactname?: string
            containerfolder: string
        }
    }
    build: {
        uploadlog: NoProperties
        updatebuildnumber: NoProperties
        addbuildtag: NoProperties
    }
    release: {
        updatereleasename: NoProperties
    }
    task: {
        addattachment: {
            type: string
            name: string
        }
        complete: {
            result: "Succeeded" | "SucceededWithIssues" | "Failed"
        }
        logdetail: {
            id: GUID
            parentid?: GUID
            type?: string
            name?: string
            order?: number
            starttime?: Datetime
            finishtime?: Datetime
            progress?: number
            state?: "Unknown" | "Initialized" | "InProgress" | "Completed"
            result?: "Succeeded" | "SucceededWithIssues" | "Failed"
        }
        logissue: {
            type: "error" | "warning"
            sourcepath?: string
            linenumber?: number
            columnnumber?: number
            code?: number
        }
        prependpath: NoProperties
        setendpoint: {
            id: string
        } & ({
            field: "authParameter" | "dataParameter"
            key: string
        } | {
            field: "url"
            key?: string // docs: "Required, unless field = url"
        })
        setprogress: {
            value: number
        }
        setvariable: {
            variable: string
            issecret?: boolean
            isoutput?: boolean
            isreadonly?: boolean
        }
        uploadfile: NoProperties
        uploadsummary: NoProperties
    }
};

/**
 * Serializes a dictionary of properties to the `key=value;` syntax used in `vso` commands.
 */
export function serializeProperties<
    Ar extends Area,
    Ac extends Action<Ar>,
>(
    properties: Properties<Ar, Ac>,
): string {
    return (
        Object.entries(properties)
        .map(([ key, value ]) => `${key}=${String(value)};`)
        .join("")
    );
}
