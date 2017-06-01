#!/usr/bin/env node
const program = require("commander");
const chalk = require("chalk");

const { portToProc, procToPort } = require("./index");
const config = require("./package.json");

let id;
let input;
let isPort;

const print_output = output => {
    if (!output) {
        let msg;
        if (isPort) {
            msg = "No process is using port: " + input;
        } else {
            msg = "No port is being used by process: " + input;
        }
        msg = chalk.red.inverse(msg);
        console.error(msg); // eslint-disable-line no-console
    } else {
        console.log(output); // eslint-disable-line no-console
    }
};

program
    .version(config.version)
    .arguments("<:port|pid>")
    .action(input => {
        id = input;
    });

program.parse(process.argv);

if (!id) {
    program.help();
}

if (id[0] === ":") {
    input = parseInt(id.slice(1), 0);
    isPort = true;
    portToProc(input).then(print_output);
} else {
    input = parseInt(id, 0);
    isPort = false;
    procToPort(input).then(print_output);
}
