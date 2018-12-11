var helperMethods = require('./helperMethods');
var Executer = require('./Executer');

module.exports = class Helm {
    constructor(config) {        
        this.config = config;        
        this.executer = new Executer(config.helmCommand, config.output);
    }

    command = function(commandString, done){
        this.executer.callByCommand(commandString, callbackHandler(done));
    }
    
    install = function (options, done) {
        var command = ['install', options.chartName];
        if (options.releaseName) {
            command.push('--name');
            command.push(options.releaseName);
        }
        if (options.namespace) {
            command.push('--namespace');
            command.push(options.namespace);
        }
        if (options.values) {
            command.push('--set');       
            command.push(helperMethods.flattenValuesToString(valuesString));
        }

        this.executer.callByArguments(command, callbackHandler(done));        
    }

    upgrade = function (options, done) {        
        var command = ['upgrade', options.releaseName];
        if (options.releaseName) {
            command.push(options.chartName);
        }
    
        if (options.values) {
            command.push('--set');
            var valuesString  = helperMethods.flattenValuesToString(valuesString);
            valuesString = valuesString.slice(0, -1);
            command.push(valuesString);
        }
        if (options.reuseValues) {
            command.push('--reuse-values');
        }
    
        this.executer.callByArguments(command, callbackHandler(done)); 
    }

    delete = function (name, shouldPurge, done) {
        var command = ['delete'];
        if(shouldPurge){
            command.push('--purge');
        }
        command.push(name);
        this.executer.callByArguments([command], callbackHandler(done));         
    }
}

function callbackHandler(done) {
    return function (err, data) {
        if (err) {
            console.error(err);
            done(err, data);
        }
        else {
            done(null, data);
        }
    };
}
