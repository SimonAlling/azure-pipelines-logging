import * as tsd from "tsd";

import { command, format, log } from "./index";
import * as cmd from "./internal/command";

// Most test cases are examples from the official documentation.
// https://docs.microsoft.com/en-us/azure/devops/pipelines/scripts/logging-commands

describe(command, () => {
    function subtest(x: keyof CommandTest) { return x; }
    const TESTS = commandTests();
    for (const [ area, areaTests ] of Object.entries(TESTS)) {
        describe(area, () => {
            for (const [ action, test ] of Object.entries(areaTests)) {
                describe(action, () => {
                    it(subtest("documentation"), () => {
                        const URL_PATTERN = /^https?:\/\//;
                        expect(test.documentation).toMatch(URL_PATTERN);
                        expect(test.documentation).toContain("#" + action);
                    });
                    it(subtest("typings"), test.typings);
                    expect(test.examples).not.toHaveLength(0);
                    it(subtest("examples"), () => {
                        for (const example of test.examples) {
                            expect(example.actual).toEqual(example.expected);
                        }
                    });
                });
            }
        });
    }
});

describe(format, () => {
    it("command", () => {
        const actual = format("command")("Command-line being run");
        const expected = `##[command]Command-line being run`;
        expect(actual).toEqual(expected);
    });
    it("debug", () => {
        const actual = format("debug")("Debug text", "Next line");
        const expected = `##[debug]Debug text\n##[debug]Next line`;
        expect(actual).toEqual(expected);
    });
    it("endgroup", () => {
        const actual = format("endgroup")();
        const expected = `##[endgroup]`;
        expect(actual).toEqual(expected);
    });
    it("error", () => {
        const actual = format("error")("Error message", "Next line");
        const expected = `##[error]Error message\n##[error]Next line`;
        expect(actual).toEqual(expected);
    });
    it("group", () => {
        const actual = format("group")("Beginning of a group");
        const expected = `##[group]Beginning of a group`;
        expect(actual).toEqual(expected);
    });
    it("warning", () => {
        const actual = format("warning")("Warning message", "Next line");
        const expected = `##[warning]Warning message\n##[warning]Next line`;
        expect(actual).toEqual(expected);
    });
});

describe(log, () => {
    it("console.log", () => {
        console.log = jest.fn();
        log("HALLOJ");
        expect(console.log).toHaveBeenCalledWith("HALLOJ");
    });
});

type CommandTest = Readonly<{
    /**
     * Link to the documentation for the action being tested, including a fragment identifier starting with the name of the action.
     */
    documentation: string
    /**
     * Expectations on types related to the action being tested.
     */
    typings: jest.EmptyFunction
    /**
     * Examples of actual commands from the official documentation.
     */
    examples: readonly {
        expected: string
        actual: string
    }[]
}>;

function commandTests(): {
    // This ensures that all actions in all areas are tested.
    readonly [Ar in cmd.Area]: {
        readonly [Ac in cmd.Action<Ar>]: CommandTest
    }
} {
    const ANY_STRING: string = "whatever";
    const ANY_NUMBER: number = 1337;
    let NO_PROPERTIES: cmd.NoProperties;
    const ANY_PROPERTIES = { foo: "bar" } as const;
    return {
        artifact: {
            associate: {
                documentation: "https://docs.microsoft.com/en-us/azure/devops/pipelines/scripts/logging-commands#associate-initialize-an-artifact",
                typings: () => {
                    tsd.expectType<cmd.PropertyValue<"artifact", "associate", "artifactname">>(ANY_STRING);
                    type Type = cmd.PropertyValue<"artifact", "associate", "type">;
                    tsd.expectAssignable<Type>("container");
                    tsd.expectAssignable<Type>("filepath");
                    tsd.expectAssignable<Type>("versioncontrol");
                    tsd.expectAssignable<Type>("gitref");
                    tsd.expectAssignable<Type>("tfvclabel");
                    tsd.expectNotAssignable<Type>(ANY_STRING);
                },
                examples: [
                    {
                        expected: `##vso[artifact.associate artifactname=MyServerDrop;type=container;]#/1/build`,
                        actual: command("artifact", "associate", { artifactname: "MyServerDrop", type: "container" })("#/1/build"),
                    },
                ],
            },
            upload: {
                documentation: "https://docs.microsoft.com/en-us/azure/devops/pipelines/scripts/logging-commands#upload-upload-an-artifact",
                typings: () => {
                    tsd.expectType<cmd.PropertyValue<"artifact", "upload", "artifactname">>(ANY_STRING);
                    tsd.expectType<cmd.PropertyValue<"artifact", "upload", "containerfolder">>(ANY_STRING);
                },
                examples: [
                    {
                        expected: `##vso[artifact.upload artifactname=uploadedresult;containerfolder=testresult;]c:\\testresult.trx`,
                        actual: command("artifact", "upload", { artifactname: "uploadedresult", containerfolder: "testresult" })("c:\\testresult.trx"),
                    },
                ],
            },
        },
        build: {
            addbuildtag: {
                documentation: "https://docs.microsoft.com/en-us/azure/devops/pipelines/scripts/logging-commands#addbuildtag-add-a-tag-to-the-build",
                typings: () => {
                    tsd.expectType<cmd.Properties<"build", "addbuildtag">>(NO_PROPERTIES);
                    tsd.expectNotAssignable<cmd.Properties<"build", "addbuildtag">>(ANY_PROPERTIES);
                },
                examples: [
                    {
                        expected: `##vso[build.addbuildtag]Tag_UnitTestPassed`,
                        actual: command("build", "addbuildtag")("Tag_UnitTestPassed"),
                    },
                ],
            },
            updatebuildnumber: {
                documentation: "https://docs.microsoft.com/en-us/azure/devops/pipelines/scripts/logging-commands#updatebuildnumber-override-the-automatically-generated-build-number",
                typings: () => {
                    tsd.expectType<cmd.Properties<"build", "updatebuildnumber">>(NO_PROPERTIES);
                    tsd.expectNotAssignable<cmd.Properties<"build", "updatebuildnumber">>(ANY_PROPERTIES);
                },
                examples: [
                    {
                        expected: `##vso[build.updatebuildnumber]my-new-build-number`,
                        actual: command("build", "updatebuildnumber")("my-new-build-number"),
                    },
                ],
            },
            uploadlog: {
                documentation: "https://docs.microsoft.com/en-us/azure/devops/pipelines/scripts/logging-commands#uploadlog-upload-a-log",
                typings: () => {
                    tsd.expectType<cmd.Properties<"build", "uploadlog">>(NO_PROPERTIES);
                    tsd.expectNotAssignable<cmd.Properties<"build", "uploadlog">>(ANY_PROPERTIES);
                },
                examples: [
                    {
                        expected: `##vso[build.uploadlog]c:\\msbuild.log`,
                        actual: command("build", "uploadlog")("c:\\msbuild.log"),
                    },
                ],
            },
        },
        release: {
            updatereleasename: {
                documentation: "https://docs.microsoft.com/en-us/azure/devops/pipelines/scripts/logging-commands#updatereleasename-rename-current-release",
                typings: () => {
                    tsd.expectType<cmd.Properties<"release", "updatereleasename">>(NO_PROPERTIES);
                    tsd.expectNotAssignable<cmd.Properties<"release", "updatereleasename">>(ANY_PROPERTIES);
                },
                examples: [
                    {
                        expected: `##vso[release.updatereleasename]my-new-release-name`,
                        actual: command("release", "updatereleasename")("my-new-release-name"),
                    },
                ],
            },
        },
        task: {
            addattachment: {
                documentation: "https://docs.microsoft.com/en-us/azure/devops/pipelines/scripts/logging-commands#addattachment-attach-a-file-to-the-build",
                typings: () => {
                    tsd.expectType<cmd.PropertyValue<"task", "addattachment", "name">>(ANY_STRING);
                    tsd.expectType<cmd.PropertyValue<"task", "addattachment", "type">>(ANY_STRING);
                },
                examples: [
                    {
                        expected: `##vso[task.addattachment type=myattachmenttype;name=myattachmentname;]c:\\myattachment.txt`,
                        actual: command("task", "addattachment", { type: "myattachmenttype", name: "myattachmentname" })("c:\\myattachment.txt"),
                    },
                ],
            },
            complete: {
                documentation: "https://docs.microsoft.com/en-us/azure/devops/pipelines/scripts/logging-commands#complete-finish-timeline",
                typings: () => {
                    type Result = cmd.PropertyValue<"task", "complete", "result">;
                    tsd.expectAssignable<Result>("Succeeded");
                    tsd.expectAssignable<Result>("SucceededWithIssues");
                    tsd.expectAssignable<Result>("Failed");
                    tsd.expectNotAssignable<Result>(ANY_STRING);
                },
                examples: [
                    {
                        expected: `##vso[task.complete result=Succeeded;]DONE`,
                        actual: command("task", "complete", { result: "Succeeded" })("DONE"),
                    },
                ],
            },
            logdetail: {
                documentation: "https://docs.microsoft.com/en-us/azure/devops/pipelines/scripts/logging-commands#logdetail-create-or-update-a-timeline-record-for-a-task",
                typings: () => {
                    tsd.expectType<cmd.PropertyValue<"task", "logdetail", "id">>(ANY_STRING);
                    tsd.expectType<cmd.PropertyValue<"task", "logdetail", "parentid">>(ANY_STRING);
                    tsd.expectType<cmd.PropertyValue<"task", "logdetail", "type">>(ANY_STRING); // https://docs.microsoft.com/en-us/rest/api/azure/devops/build/timeline/get#timelinerecord
                    tsd.expectType<cmd.PropertyValue<"task", "logdetail", "name">>(ANY_STRING);
                    tsd.expectType<cmd.PropertyValue<"task", "logdetail", "order">>(ANY_NUMBER);
                    tsd.expectType<cmd.PropertyValue<"task", "logdetail", "starttime">>(ANY_STRING);
                    tsd.expectType<cmd.PropertyValue<"task", "logdetail", "finishtime">>(ANY_STRING);
                    type Progress = cmd.PropertyValue<"task", "logdetail", "progress">;
                    tsd.expectAssignable<Progress>(0);
                    tsd.expectAssignable<Progress>(50);
                    tsd.expectAssignable<Progress>(100);
                    tsd.expectNotAssignable<Progress>(ANY_STRING);
                    type State = cmd.PropertyValue<"task", "logdetail", "state">;
                    tsd.expectAssignable<State>("Completed");
                    tsd.expectAssignable<State>("Initialized");
                    tsd.expectAssignable<State>("InProgress");
                    tsd.expectAssignable<State>("Unknown");
                    tsd.expectNotAssignable<State>(ANY_STRING);
                    type Result = cmd.PropertyValue<"task", "logdetail", "result">;
                    tsd.expectAssignable<Result>("Succeeded");
                    tsd.expectAssignable<Result>("SucceededWithIssues");
                    tsd.expectAssignable<Result>("Failed");
                    tsd.expectNotAssignable<Result>(ANY_STRING);
                },
                examples: [
                    {
                        expected: `##vso[task.logdetail id=new guid;name=project1;type=build;order=1;]create new timeline record`,
                        actual: command("task", "logdetail", { id: "new guid", name: "project1", type: "build", order: 1 })("create new timeline record"),
                    },
                    {
                        expected: `##vso[task.logdetail id=new guid;parentid=exist timeline record guid;name=project1;type=build;order=1;]create new nested timeline record`,
                        actual: command("task", "logdetail", { id: "new guid", parentid: "exist timeline record guid", name: "project1", type: "build", order: 1 })("create new nested timeline record"),
                    },
                    {
                        expected: `##vso[task.logdetail id=existing timeline record guid;progress=15;state=InProgress;]update timeline record`,
                        actual: command("task", "logdetail", { id: "existing timeline record guid", progress: 15, state: "InProgress" })("update timeline record"),
                    },
                ],
            },
            logissue: {
                documentation: "https://docs.microsoft.com/en-us/azure/devops/pipelines/scripts/logging-commands#logissue-log-an-error-or-warning",
                typings: () => {
                    type Type = cmd.PropertyValue<"task", "logissue", "type">;
                    tsd.expectAssignable<Type>("error");
                    tsd.expectAssignable<Type>("warning");
                    tsd.expectNotAssignable<Type>(ANY_STRING);
                    tsd.expectType<cmd.PropertyValue<"task", "logissue", "code">>(ANY_NUMBER);
                    tsd.expectType<cmd.PropertyValue<"task", "logissue", "linenumber">>(ANY_NUMBER);
                    tsd.expectType<cmd.PropertyValue<"task", "logissue", "columnnumber">>(ANY_NUMBER);
                    tsd.expectType<cmd.PropertyValue<"task", "logissue", "sourcepath">>(ANY_STRING);
                },
                examples: [
                    {
                        expected: `##vso[task.logissue type=warning;sourcepath=consoleapp/main.cs;linenumber=1;columnnumber=1;code=100;]Found something that could be a problem.`,
                        actual: command("task", "logissue", { type: "warning", sourcepath: "consoleapp/main.cs", linenumber: 1, columnnumber: 1, code: 100 })("Found something that could be a problem."),
                    },
                ],
            },
            prependpath: {
                documentation: "https://docs.microsoft.com/en-us/azure/devops/pipelines/scripts/logging-commands#prependpath-prepend-a-path-to-the--path-environment-variable",
                typings: () => {
                    tsd.expectType<cmd.Properties<"task", "prependpath">>(NO_PROPERTIES);
                    tsd.expectNotAssignable<cmd.Properties<"task", "prependpath">>(ANY_PROPERTIES);
                },
                examples: [
                    {
                        expected: `##vso[task.prependpath]c:\\my\\directory\\path`,
                        actual: command("task", "prependpath")("c:\\my\\directory\\path"),
                    },
                ],
            },
            setendpoint: {
                documentation: "https://docs.microsoft.com/en-us/azure/devops/pipelines/scripts/logging-commands#setendpoint-modify-a-service-connection-field",
                typings: () => {
                    type Properties = cmd.Properties<"task", "setendpoint">;
                    tsd.expectAssignable<Properties>({ id: "000-0000-0000", field: "authParameter", key: ANY_STRING });
                    tsd.expectNotAssignable<Properties>({ id: "000-0000-0000", field: "authParameter" });
                    tsd.expectAssignable<Properties>({ id: "000-0000-0000", field: "dataParameter", key: ANY_STRING });
                    tsd.expectNotAssignable<Properties>({ id: "000-0000-0000", field: "dataParameter" });
                    tsd.expectAssignable<Properties>({ id: "000-0000-0000", field: "url", key: ANY_STRING });
                    tsd.expectAssignable<Properties>({ id: "000-0000-0000", field: "url" });
                    tsd.expectNotAssignable<Properties>(NO_PROPERTIES);
                },
                examples: [
                    {
                        expected: `##vso[task.setendpoint id=000-0000-0000;field=authParameter;key=AccessToken;]testvalue`,
                        actual: command("task", "setendpoint", { id: "000-0000-0000", field: "authParameter", key: "AccessToken" })("testvalue"),
                    },
                    {
                        expected: `##vso[task.setendpoint id=000-0000-0000;field=dataParameter;key=userVariable;]testvalue`,
                        actual: command("task", "setendpoint", { id: "000-0000-0000", field: "dataParameter", key: "userVariable" })("testvalue"),
                    },
                    {
                        expected: `##vso[task.setendpoint id=000-0000-0000;field=url;]https://example.com/service`,
                        actual: command("task", "setendpoint", { id: "000-0000-0000", field: "url" })("https://example.com/service"),
                    },
                ],
            },
            setprogress: {
                documentation: "https://docs.microsoft.com/en-us/azure/devops/pipelines/scripts/logging-commands#setprogress-show-percentage-completed",
                typings: () => {
                    type Value = cmd.PropertyValue<"task", "setprogress", "value">;
                    tsd.expectAssignable<Value>(0);
                    tsd.expectAssignable<Value>(50);
                    tsd.expectAssignable<Value>(100);
                    tsd.expectNotAssignable<Value>(ANY_STRING);
                },
                examples: [
                    {
                        expected: `##vso[task.setprogress value=5;]Sample Progress Indicator`,
                        actual: command("task", "setprogress", { value: 5 })("Sample Progress Indicator"),
                    },
                ],
            },
            setvariable: {
                documentation: "https://docs.microsoft.com/en-us/azure/devops/pipelines/scripts/logging-commands#setvariable-initialize-or-modify-the-value-of-a-variable",
                typings: () => {
                    tsd.expectType<cmd.PropertyValue<"task", "setvariable", "variable">>(ANY_STRING);
                    type IsSecret = cmd.PropertyValue<"task", "setvariable", "issecret">;
                    tsd.expectAssignable<IsSecret>(true);
                    tsd.expectAssignable<IsSecret>(false);
                    tsd.expectNotAssignable<IsSecret>(ANY_STRING);
                    type IsOutput = cmd.PropertyValue<"task", "setvariable", "isoutput">;
                    tsd.expectAssignable<IsOutput>(true);
                    tsd.expectAssignable<IsOutput>(false);
                    tsd.expectNotAssignable<IsOutput>(ANY_STRING);
                    type IsReadonly = cmd.PropertyValue<"task", "setvariable", "isreadonly">;
                    tsd.expectAssignable<IsReadonly>(true);
                    tsd.expectAssignable<IsReadonly>(false);
                    tsd.expectNotAssignable<IsReadonly>(ANY_STRING);
                },
                examples: [
                    {
                        expected: `##vso[task.setvariable variable=sauce;]crushed tomatoes`,
                        actual: command("task", "setvariable", { variable: "sauce" })("crushed tomatoes"),
                    },
                    {
                        expected: `##vso[task.setvariable variable=secretSauce;issecret=true;]crushed tomatoes with garlic`,
                        actual: command("task", "setvariable", { variable: "secretSauce", issecret: true })("crushed tomatoes with garlic"),
                    },
                    {
                        expected: `##vso[task.setvariable variable=outputSauce;isoutput=true;]canned goods`,
                        actual: command("task", "setvariable", { variable: "outputSauce", isoutput: true })("canned goods"),
                    },
                ],
            },
            uploadfile: {
                documentation: "https://docs.microsoft.com/en-us/azure/devops/pipelines/scripts/logging-commands#uploadfile-upload-a-file-that-can-be-downloaded-with-task-logs",
                typings: () => {
                    tsd.expectType<cmd.Properties<"task", "uploadfile">>(NO_PROPERTIES);
                    tsd.expectNotAssignable<cmd.Properties<"task", "uploadfile">>(ANY_PROPERTIES);
                },
                examples: [
                    {
                        expected: `##vso[task.uploadfile]c:\\additionalfile.log`,
                        actual: command("task", "uploadfile")("c:\\additionalfile.log"),
                    },
                ],
            },
            uploadsummary: {
                documentation: "https://docs.microsoft.com/en-us/azure/devops/pipelines/scripts/logging-commands#uploadsummary-add-some-markdown-content-to-the-build-summary",
                typings: () => {
                    tsd.expectType<cmd.Properties<"task", "uploadsummary">>(NO_PROPERTIES);
                    tsd.expectNotAssignable<cmd.Properties<"task", "uploadsummary">>(ANY_PROPERTIES);
                },
                examples: [
                    {
                        expected: `##vso[task.uploadsummary]c:\\testsummary.md`,
                        actual: command("task", "uploadsummary")("c:\\testsummary.md"),
                    },
                ],
            },
        },
    };
}
