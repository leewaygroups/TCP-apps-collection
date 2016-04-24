/*Require module */
const  _ = require('underscore');
 
var utils = {
    isValidString: function (str) {
        return /^[a-zA-Z]+$/.test(str);
    },
    
    isJSONObject: function (input) {
        return Object.prototype.toString.call(input) === '[object Object]';
    },

    /* Validate login credential to worker process 
    *worker process running in remote server */
    isValidCredential: function (inputArg) {
        return utils.isJSONObject(inputArg) && inputArg.hasOwnProperty('name');
    },
    
    /* Validate worker command from users */
    isValidWorkerCommand: function (cmd) {
        return utils.isJSONObject(cmd)
            && cmd.hasOwnProperty('request')
            && (cmd['request'] === 'time' || cmd['request'] === 'count');
    },
    
    /* format JSON object for prettyDisplay*/
    objectFormater: function (inputObj) {
        var resultObj = {};

        /*IIFE to flatten nested JSON object to single level JSON object*/
        (function flattenObject(obj) {
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    if (utils.isJSONObject(obj[prop])) {
                        flattenObject(obj[prop]);
                    } else {
                    
                        /*cli-table module internally calls toString() on object values.
                         *Convert any null/underfined value to empty string to prevent toString()
                         *invokation on null/underfined which will throw Exception. 
                        */
                        resultObj[prop] = obj[prop] || "";
                    }
                }
            }
        } (inputObj));

        return resultObj;
    },
    
    isValidInstruction: function (instruction) {
        var keys;
        try {
            keys = _.keys(instruction);
        } catch (error) {
            return false;
        }

        var isExpectedLength = keys.length === 1 || keys.length === 2;
        var isCredentialInstruction = (_.indexOf(keys, 'name') > -1 && utils.isValidString(instruction['name']));
        var isShortRequestInstruction = (_.indexOf(keys, 'request') > -1 && utils.isValidString(instruction['request']));
        var isLongRequestInstruction = (_.indexOf(keys, 'request') > -1
            && _.indexOf(keys, 'id') > -1
            && utils.isValidString(instruction['request'])
            && utils.isValidString(instruction['id']));

        return isExpectedLength && (isCredentialInstruction || isShortRequestInstruction || isLongRequestInstruction);
    }
};

module.exports = utils;