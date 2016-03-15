# Ceph Object Gateway AdminOps API client
This module contains a Node.js wrapper around the HTTP API of [Ceph Object Gateway's](http://docs.ceph.com/docs/master/radosgw/) [Admin Ops API](http://docs.ceph.com/docs/master/radosgw/adminops/). 

## Installation
The module can be installed via

```bash
npm install ceph-admin-ops-client --save
```

## Basic usage
As a minimum, the `accessKey`, `secretKey`, `host` and `port` properties need to be set when using this module. Each method returns a promise.

**Setup**
```javascript
var AdminOpsAPI = require("ceph-admin-ops-client");

var api = new AdminOpsAPI({
    accessKey: "<<ACCESS_KEY>>",
    secretKey: "<<SECRET_KEY>>",
    host: "192.168.0.100",
    port: 10000
});
```

**Sample method call:**
```javascript
api.getUserInfo({ uid: "myUser" }).then(function(userInfo){
    console.log(JSON.stringify(userInfo));
}).catch(function(error) {
    console.log(JSON.stringify(error));
});
```

### Configuration properties

* `accessKey`: The access key with which the API shall be used.
* `secretKey`: The secret key with which the API shall be used.
* `host`: Either the IP address or the hostname of the Ceph Object Gateway endpoint (default is `s3.amazonaws.com`).
* `port`: The port of the Ceph Object Gateway endpoint (default is `80`).
* `protocol`: Either `http` or `https` (default is `http`).
* `useSubdomain`: If a subdomain shall be used (boolean). Default is `false`.
* `adminBucket`: The name of the "admin bucket" (the URI which is configured for the base admin endpoint). Default is `admin`.
* `expiresInMinutes`: The time in minutes until the request expires (default is `10`).

## Methods
The `parameters` argument for the methods (see below) is an object containing a property map, for example

```javascript
{
    "uid": "myUser",
    "bucket": "myBucket"
}
```

{{#each methods}}

### {{name}}(parameters)
{{description}}
  
| Parameter | Data Type | Mandatory? |
| --------- | --------- | --------- |
{{#parameters}}
| {{name}} | {{dataType}} | {{mandatory}} |
{{/parameters}}

{{/each}}