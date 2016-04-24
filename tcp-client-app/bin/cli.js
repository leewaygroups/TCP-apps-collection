#!/usr/bin/env node

/*Require modules */
var _ = require('underscore');
var ClientApp = require('../app/testClient');
var utils = require('../app/utils');

process.stdin.resume();
process.stdin.setEncoding('utf8');

var app = new ClientApp.Client();
app.connect();
var isLoggedIn = false;

process.stdin.on('data', function (jsonInstruction) {
    switch (jsonInstruction) {
        case 'quit\n':
            done();
            break;
        default:
            inputHandler(app, jsonInstruction);
            break;
    }
});

function inputHandler(app, instruction) {
    try {
        /*inputHandler does at the moment only hanles JSON as a single line
        * hence, any JSON with linebreaks will be rejected as an invalid command.
        * To  support linebreaks, replace (THIS LINE) with the commented instruction below:
        * instruction = instruction.replace(/\n|\r/g,"").trim() */
        instruction = instruction.trim(); // (THIS LINE).
        if(instruction.length === 0) return;
        instruction = JSON.parse(instruction.trim());
        if(!utils.isJSONObject(instruction)){
            console.log("Oops! entered command is likely not a JSON object. Enter JSON only.");
            return;
        }
    } catch (error) {
        console.log("Oops! entered command is likely not a JSON object. Enter JSON only.");
        return;
    }

    if (app && app instanceof ClientApp.Client) {

        if (!utils.isValidInstruction(instruction)) {
            app.command(instruction);
            return;
        }

        if (!app.isLoggedIn && utils.isValidCredential(instruction)) {
            var response = app.logIn(instruction);
            response === null || response === undefined ? app.isLoggedIn = true : console.log(response);
            return;
        } else if (!app.isLoggedIn) {
            process.stdout.write(`You must login first before passing instructions to worker process in this server\n`);
        } else if (app.isLoggedIn) {
            var response = app.command(instruction);
        }
    }
}

function done() {
    console.log('Client exited. Bye!');
    process.exit();
}

/*inputHandler exposed for testing*/
module.exports = inputHandler;