var handlebars = require('handlebars'),
    fs = require('fs'),
    path = require("path"),
    methods = require("../lib/methods");

var data = { methods: [] };

Object.getOwnPropertyNames(methods).forEach(function(method) {
    var methodObj = {
        name: method,
        description: methods[method].description,
        parameters: []
    };
    Object.getOwnPropertyNames(methods[method].allowedParameters).forEach(function(parameter) {
        var parameterObj = {};
        parameterObj.name = parameter;
        parameterObj.dataType = methods[method].allowedParameters[parameter];
        parameterObj.mandatory = Object.getOwnPropertyNames(methods[method].mandatoryParameters).indexOf(parameter) > -1 ? "Yes" : "No";
        methodObj.parameters.push(parameterObj);
    });

    data.methods.push(methodObj);
});

//console.log(JSON.stringify(data));

fs.readFile(path.join(__dirname, './template.md'), 'utf-8', function(error, source){

    var template = handlebars.compile(source);
    var markdown = template(data);
    console.log(markdown);

    fs.writeFileSync(path.join(__dirname, '../README.md'), markdown);

});