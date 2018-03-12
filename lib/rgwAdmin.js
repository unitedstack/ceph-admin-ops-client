var join = require("path").join;
var crypto = require("crypto");
var request = require("./request");
var Promise = require("bluebird");
var methods = require("./methods");

var AdminOpsAPI = function AdminOpsAPI(options) {

    var self = this;

    self.options = options || {};
    self.accessKey = options.accessKey || process.env.AWS_ACCESS_KEY;
    self.secretKey = options.secretKey || process.env.AWS_SECRET_KEY;
    self.endpoint = options.host || "s3.amazonaws.com";
    self.port = options.port || "80";
    self.protocol = options.protocol || "http";
    self.subdomain = options.useSubdomain === true;
    self.bucket = options.adminBucket || "admin";
    self.expiry = options.expiresInMinutes || 10;

    // Add methods dynmically
    Object.getOwnPropertyNames(methods).forEach(function(method) {
        self[method] = function(parameters) {
            var methodDefinition = methods[method],
                givenParameters = parameters || {},
                allowedParametersArray = Object.getOwnPropertyNames(methodDefinition.allowedParameters),
                mandatoryParametersArray = Object.getOwnPropertyNames(methodDefinition.mandatoryParameters),
                hasAllowedParameters = (allowedParametersArray.length > 0),
                hasMandatoryParameters = (mandatoryParametersArray.length > 0);

            return new Promise(function(resolve, reject) {

                var mandatoryParametersLeft = mandatoryParametersArray,
                    unknownParameters = [],
                    errorObj = {};

                // Check mandatory parameters
                if (hasMandatoryParameters) {
                    Object.getOwnPropertyNames(givenParameters).forEach(function(parameter) {
                        if (mandatoryParametersLeft.indexOf(parameter) > -1) {
                            // Remove mandatory parameter if found
                            mandatoryParametersLeft = mandatoryParametersLeft.splice(mandatoryParametersLeft.indexOf(parameter)+1, 1);
                        }
                    });
                    // Reject if not all mandatory parameters have been supplied
                    if (mandatoryParametersLeft.length > 0) {
                        reject({ message: "Error: Not all mandatory parameters supplied! Missing "+ mandatoryParametersLeft.toString(), mandatoryParameters: mandatoryParametersArray });
                    }
                }

                // Check supplied parameters for allowance and correct data types
                if (hasAllowedParameters) {
                    Object.getOwnPropertyNames(givenParameters).forEach(function(parameter) {
                        if (allowedParametersArray.indexOf(parameter) > -1) {
                            // Check data type (expect dates)
                            if (methodDefinition.allowedParameters[parameter] !== "date") {
                                if (typeof givenParameters[parameter] !== methodDefinition.allowedParameters[parameter] ) {
                                    errorObj[parameter] = "Expected " + methodDefinition.allowedParameters[parameter] + " but got " + (typeof givenParameters[parameter]);
                                }
                            } else {
                                // Check if date string is parseable
                                if (isNaN(Date.parse(givenParameters[parameter]))) {
                                    errorObj[parameter] = "Expected " + methodDefinition.allowedParameters[parameter] + " (YYYY-MM-DD hh:mm:ss) but got " + givenParameters[parameter] + " which is not parseable!";
                                }
                            }
                        } else {
                            unknownParameters.push(parameter);
                        }
                    });
                    // Reject if data types don"t match for allowed parameters
                    if (Object.getOwnPropertyNames(errorObj).length > 0) {
                        reject({ message: "Error: Got wrong data types!", parameters: errorObj });
                    }
                    // Reject if unknown parameters have been passed
                    if (unknownParameters.length > 0) {
                        reject({ message: "Error: Got unknown parameters", unknownParameters: unknownParameters, allowedParameters: allowedParametersArray });
                    }
                }

                // Basic request options
                var requestOptions = {
                    json: true,
                    method: methodDefinition.verb
                };

                // Check whether a parameter is present which needs to be sent via request body insteas of querystring
                if (methodDefinition.body && Object.getOwnPropertyNames(givenParameters).indexOf(methodDefinition.body.parameter)) {
                    // Add to request body
                    requestOptions.body = givenParameters[methodDefinition.body.parameter];
                    // Remove from querystring parameters
                    delete givenParameters[methodDefinition.body.parameter];
                }

                // Add signed url to request options
                requestOptions.url = self.getSignedUrl(methodDefinition, givenParameters);

                // Do request to Ceph Object Storage API
                request(requestOptions).then(function(response) {
                    if (response.statusCode === 200 || response.statusCode === 201) {
                        resolve(response.body);
                    } else {
                        reject({ message: "Error: Ceph Object Gateway returned non-ok status code: " + response.statusCode, statusCode: response.statusCode });
                    }
                }).catch(function(error) {
                    reject({ message: error });
                });

            });
        }
    });

    // s3 api

    this.createBucket = function(bucketObj) {
        var requestOptions = {
            json: true,
            method: 'PUT'
        }
        var bucketName = bucketObj.name;
        var bucketACL = bucketObj.acl;
        var methdDefinition = {
            path: '/' + bucketName
        }
        requestOptions.url = self.getSignedUrl()

    }

};

AdminOpsAPI.prototype.hmacSha1 = function (message) {
    var self = this;
    return crypto.createHmac("sha1", self.secretKey)
        .update(message)
        .digest("base64");
};

AdminOpsAPI.prototype.hexDigest = function (message) {
    return crypto.createHash('sha256')
        .update(message, 'utf8')
        .digest('hex');
};

AdminOpsAPI.prototype.getUrl = function (uri) {
    var self = this;
    if (self.subdomain) {
        return self.protocol + "://"+ self.bucket + "." + self.endpoint + (self.port != 80 ? ":" + self.port : "") + uri;
    } else {
        return self.protocol + "://"+ self.endpoint + (self.port != 80 ? ":" + self.port : "") + "/" + self.bucket + uri;
    }
};

AdminOpsAPI.prototype.getSignedUrl = function(methodDefinition, queryParameters){

    var self = this;
    var expires = new Date();

    expires.setMinutes(expires.getMinutes() + self.expiry);

    var epo = Math.floor(expires.getTime()/1000);

    var str = methodDefinition.verb + "\n\n\n" + epo + "\n" + "/" + self.bucket + methodDefinition.path;

    if (methodDefinition.body) {
        str += "\n" + self.hexDigest(JSON.stringify({"test":true}))
    }

    var hashed = self.hmacSha1(str);

    var urlRet = self.getUrl(methodDefinition.path) +
        "?Expires=" + epo +
        "&AWSAccessKeyId=" + self.accessKey +
        "&Signature=" + encodeURIComponent(hashed) +
        "&format=json";

    // Add Ceph-internal parameters
    if (methodDefinition.internalParameters) {
        Object.getOwnPropertyNames(methodDefinition.internalParameters).forEach(function(parameter) {
            if (methodDefinition.internalParameters[parameter] === "null") {
                urlRet += "&" + parameter;
            } else {
                urlRet += "&" + parameter + "=" + methodDefinition.internalParameters[parameter];
            }
        });
    }

    // Add custom querystring parameters
    if (queryParameters && Object.getOwnPropertyNames(queryParameters).length > 0) {
        Object.getOwnPropertyNames(queryParameters).forEach(function(parameter) {
            urlRet += "&" + parameter + "=" + encodeURIComponent(queryParameters[parameter]);
        });
    }

    return urlRet;

};

module.exports = AdminOpsAPI;
