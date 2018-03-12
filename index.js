var RgwAdmin = require('./lib/rgwAdmin');
var S3 = require('./lib/s3');

function client(options) {
  this.admin = new RgwAdmin(options);
  this.s3 = new S3(options);
}

module.exports = client;