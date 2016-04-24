/** Require modules */
const servers = require('./server'),
    Table = require('cli-table'),
    _ = require('underscore'),
    net = require('net'),
    utils = require('./utils');
    
var EventEmitter = require('events').EventEmitter;
var util = require('util');

/**Get connection object to remote server*/
var remoteServer = servers.remoteServer;

/**Object with listeners for client socket events*/
var handlerObj = {
    onError: function (err) {
        console.log(err);
        console.log('Trying to reconnect...');
    },
    onClose: function () {
        console.log('Connection closed');
    },
    onData: function (data) {
        var response = JSON.parse(data.toString());
        this.lastDataTime = new Date();

        var random = prettyDisplay(response)["random"];
        if (random && Number(random) > 30) {
            console.log('----------Alert----------');
            console.log('Random number from "time" call is greater thab 30');
        }
        
        /**fake newline spaceout previous output from next instruction in console*/
        console.log();
    }
};

/**cache for longin credentials*/
var cache = {};

/**Client application*/
function ClientApp() {
    EventEmitter.call(this);
    
    var self = this;
    self.client;
    self.lastDataTime;
    self.isLoggedIn = false;

    self.connect = function () {
        self.client = new net.Socket().connect(remoteServer.PORT, remoteServer.HOST, function () {
            self.isConnected = true;
            console.log("connected successfully");
        });

        self.client.on('error', handlerObj.onError);
        self.client.on('close', handlerObj.onClose);
        self.client.on('data', handlerObj.onData.bind(self));
        self.isConnected = true;
    }

    self.logIn = function (credentials) {
        if (utils.isValidCredential(credentials)) {
            try {
                self.client.write(JSON.stringify(credentials));
                self.lastDataTime = new Date();
                cache.loginCredential = credentials;
                self.emit('logged-in');

                /**Check last response time from server and 
                 * if > 2secs initiate client reconnection and re-login process.
                 * Commented out because at the moment server seem not to send heartbeat messages.
                 * Uncomment the piece of code below to active reconnection/re-login feature */
                /*var interval = setInterval(function () {
                    if (!self.lastDataTime || (new Date().getTime() - self.lastDataTime.getTime()) > 2000) {
                        reconnectAndRelogin(interval, self.client, handlerObj);
                    }
                }, 2000);  */

            } catch (error) {
                self.emit('loggIn-failed');
                return "Invalid login. Enter JSON object with key/value pair of 'name'/NAME as login credential.";
            }
        } else {
            self.emit('loggIn-failed');
            return "Invalid login. Enter JSON object with key/value pair of 'name'/NAME as login credential.";
        }
    }

    self.command = function (cmd) {
        if (utils.isValidWorkerCommand(cmd)) {
            try {
                self.client.write(JSON.stringify(cmd));
                self.emit('cmd-executing');
            } catch (error) {
                self.emit('cmd-failed');
                return "Error occcured while executing command, try again."
            }
        } else {
            self.emit('cmd-invalid');
            return "Invalid command. Enter JSON object with key/value pairs of 'request'/REQUEST and 'id'/ID. " +
                "Only two REQUEST strings are supported - 'count' and 'time'";
        }
    }
}
/**ClientApp inherit EventEmitter */
util.inherits(ClientApp, EventEmitter);

/**Reconnection and re-login client to server */
function reconnectAndRelogin(interval, client, handler) {
    console.log("Server not responding. Please wait while we try to reconnect and re-login ...");
    clearInterval(interval);
    client.destroy();
    var newClient = new ClientApp();
    newClient.logIn(cache.loginCredential);
    return newClient;
}



/**Display result in a nicely formatted way*/
function prettyDisplay(json) {
    json = utils.objectFormater(json);
    var header = _.keys(json);
    var values = _.values(json);
    var colWidths = (new Array(header.length)).fill(27);

    var dataTable = new Table({
        head: header,
        colWidths: colWidths
    });
    dataTable.push(values);

    console.log(dataTable.toString());

    return json
}

/**IIFE util to fill array with supplied value.
*Polyfilled in case of execution in JS env ealier than ES6.*/
(function () {
    if (!Array.prototype.fill) {
        Array.prototype.fill = function (value) {
            var self = this;
            var i = self.length;
            while (i--) {
                self[i] = value;
            }

            return self;
        };
    }
} ())

module.exports.Client = ClientApp;

/** Expose handlerObj so it can be spied in unit tests */
module.exports.handlerObject = handlerObj;