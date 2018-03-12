var join = require("path").join;
var crypto = require("crypto");
var request = require("./request");
var Promise = require("bluebird");
// var methods = require("./methods");

var S3 = function S3(options) {

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

    this.createBucket = function(bucketObj) {
        var requestOptions = {
            json: true,
            method: 'PUT'
        };
        var bucketName = bucketObj.name;
        var methdDefinition = {
            path: '/' + bucketName,
            verb: 'PUT'
        };
        var bucketACL = bucketObj.acl;
        if (bucketACL) {
            methdDefinition.headerString = 'x-amz-acl:' + bucketACL;
            requestOptions.headers = {
                "x-amz-acl": bucketACL
            };
        }
        requestOptions.url = self.getSignedUrl(methdDefinition);
        return new Promise(function(resolve, reject) {
            request(requestOptions).then(function(response) {
                if (response.statusCode === 200 || response.statusCode === 201) {
                    resolve(response.body);
                } else {
                    reject({ message: "Error: Ceph Object Gateway returned non-ok status code: " + response.statusCode, statusCode: response.statusCode });
                }
            }).catch(function(error) {
                reject({ message: error });
            });
        })
        
    }

};

S3.prototype.hmacSha1 = function (message) {
    var self = this;
    return crypto.createHmac("sha1", self.secretKey)
        .update(message)
        .digest("base64");
};

S3.prototype.hexDigest = function (message) {
    return crypto.createHash('sha256')
        .update(message, 'utf8')
        .digest('hex');
};

S3.prototype.getUrl = function (uri) {
    var self = this;
    
    return self.protocol + "://"+ self.endpoint + (self.port != 80 ? ":" + self.port : "") + uri;
};

S3.prototype.getSignedUrl = function(methodDefinition, queryParameters){

    var self = this;
    var expires = new Date();

    expires.setMinutes(expires.getMinutes() + self.expiry);

    var epo = Math.floor(expires.getTime()/1000);

    var str = methodDefinition.verb + "\n\n\n" + epo + "\n";
    if (methodDefinition.headerString) {
        str  = str + methodDefinition.headerString + "\n" + methodDefinition.path;
    } else {
        str = str + methodDefinition.path; 
    }
    // str = str + (methodDefinition.headerString ? (methodDefinition.headerString + "\n") : methodDefinition.headerString)

    var hashed = self.hmacSha1(str);

    var urlRet = self.getUrl(methodDefinition.path) +
        "?Expires=" + epo +
        "&AWSAccessKeyId=" + self.accessKey +
        "&Signature=" + encodeURIComponent(hashed) +
        "&format=json";
    return urlRet;

};

module.exports = S3;
