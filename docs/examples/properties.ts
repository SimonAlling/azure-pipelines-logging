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
