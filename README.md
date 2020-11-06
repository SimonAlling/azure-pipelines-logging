# azure-pipelines-logging

[![NPM Version][shield-npm]][npm-url]
[![Downloads Stats][shield-downloads]][npm-url]

[npm-url]: https://npmjs.org/package/azure-pipelines-logging
[shield-npm]: https://img.shields.io/npm/v/azure-pipelines-logging.svg
[shield-downloads]: https://img.shields.io/npm/dm/azure-pipelines-logging.svg

A typed API for [Azure Pipelines logging commands](https://docs.microsoft.com/en-us/azure/devops/pipelines/scripts/logging-commands).
Designed to be used with TypeScript.

## Installation

```
npm install --save azure-pipelines-logging
```

## Usage

```ts
// docs/examples/basic.ts

import { command, format, log } from "azure-pipelines-logging";

log(command("task", "logissue", { type: "error" })("Error summary"));
log(format("error")(
    "Details about error.",
    "Second line of details.",
    "Third and\nfourth line.",
));

/*
Output:
##vso[task.logissue type=error;]Error summary
##[error]Details about error.
##[error]Second line of details.
##[error]Third and
##[error]fourth line.
*/

```

### Typechecking and Autocompletion

The exported functions are typed as strictly as possible and in a way such that editors can provide useful autocompletion.
For example, give `"task"` as the first argument to `command` to get autocompletion for all actions in the `task` area:

<img
    src="docs/autocompletion.png"
    alt="Autocompletion for the `task` area"
/>

### Properties

The properties that each command supports, if any, are encoded in the types.

```ts
// docs/examples/properties.ts

import { command, log } from "azure-pipelines-logging";

const addbuildtag = command("build", "addbuildtag");

const associate = command("artifact", "associate", {
    artifactname: "whatever",
    type: "container", // Type error if invalid value given.
    // Type error if unknown property given or required property missing.
});

log(addbuildtag("Tag_UnitTestPassed"));
log(associate("#/1/build"));

/*
Output:
##vso[build.addbuildtag]Tag_UnitTestPassed
##vso[artifact.associate artifactname=whatever;type=container;]#/1/build
*/

```

### `log` vs `console.log`

The exported `log` function is a more strictly typed alias for `console.log` that eliminates this class of bugs:

```ts
// docs/examples/console.log-bad.ts

import { command } from "azure-pipelines-logging";

console.log(
    command("task", "logissue", { type: "error" }) // A function, not a string!
);

/*
Output:
[Function (anonymous)]
*/

```

This bug is made possible by the combination of `command` (and `format`) being [curried](https://en.wikipedia.org/wiki/Currying) and `console.log` taking parameters of type `any`.
Correct code:

```ts
// docs/examples/console.log-good.ts

import { command } from "azure-pipelines-logging";

console.log(
    command("task", "logissue", { type: "error" })("Error summary")
);

/*
Output:
##vso[task.logissue type=error;]Error summary
*/

```

Using `log` instead of `console.log` prevents such mistakes by making them static type errors.

## Contribute

Run these commands to build everything and run the tests:

```
npm ci
npm run make
```

[`embedme`](https://github.com/zakhenry/embedme) is used for code examples in the readme.
