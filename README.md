# Ceph Object Gateway AdminOps API client
This module contains a Node.js wrapper around the HTTP API of [Ceph Object Gateway's](http://docs.ceph.com/docs/master/radosgw/) [Admin Ops API](http://docs.ceph.com/docs/master/radosgw/adminops/). 

## Installation
The module can be installed via

```bash
npm install rgw-admin-client --save
```

## Basic usage
As a minimum, the `accessKey`, `secretKey`, `host` and `port` properties need to be set when using this module. Each method returns a promise.

**Setup**
```javascript
var RGW = require("rgw-admin-client");

var rgw = new RGW({
    accessKey: "<<ACCESS_KEY>>",
    secretKey: "<<SECRET_KEY>>",
    host: "192.168.0.100",
    protocol: "http",
    port: 10000
});

// rgw admin api client
var admin = rgw.admin;

// rgw s3 api client
var s3 = rgw.s3
```

**Sample rgw admin method call:**
```javascript
admin.getUserInfo({ uid: "myUser" }).then(function(userInfo){
    console.log(JSON.stringify(userInfo));
}).catch(function(error) {
    console.log(JSON.stringify(error));
});
```
**Sample rgw s3 method call:**
```javascript
s3.createBucket({ name: "bucket", acl: "private" }).then(function(bucket){
    console.log(JSON.stringify(bucket));
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


### getUsage(parameters)
Request bandwidth usage information.
  
| Parameter | Data Type | Mandatory? |
| --------- | --------- | --------- |
| uid | string | No |
| start | date | No |
| end | date | No |
| show-entries | boolean | No |
| show-summary | boolean | No |


### trimUsage(parameters)
Remove usage information. With no dates specified, removes all usage information.
  
| Parameter | Data Type | Mandatory? |
| --------- | --------- | --------- |
| uid | string | No |
| start | date | No |
| end | date | No |
| remove-all | boolean | No |
| show-summary | boolean | No |


### getUserInfo(parameters)
Get user information. If no user is specified returns the list of all users along with suspension information.
  
| Parameter | Data Type | Mandatory? |
| --------- | --------- | --------- |
| uid | string | Yes |


### createUser(parameters)
Create a new user. By Default, a S3 key pair will be created automatically and returned in the response. If only one of access-key or secret-key is provided, the omitted key will be automatically generated. By default, a generated key is added to the keyring without replacing an existing key pair. If access-key is specified and refers to an existing key owned by the user then it will be modified.
  
| Parameter | Data Type | Mandatory? |
| --------- | --------- | --------- |
| uid | string | Yes |
| display-name | string | Yes |
| email | string | No |
| key-type | string | No |
| access-key | string | No |
| secret-key | string | No |
| user-caps | string | No |
| generate-key | boolean | No |
| max-buckets | number | No |
| suspended | boolean | No |


### updateUser(parameters)
Modify a user.
  
| Parameter | Data Type | Mandatory? |
| --------- | --------- | --------- |
| uid | string | Yes |
| display-name | string | No |
| email | string | No |
| key-type | string | No |
| access-key | string | No |
| secret-key | string | No |
| user-caps | string | No |
| generate-key | boolean | No |
| max-buckets | number | No |
| suspended | boolean | No |


### deleteUser(parameters)
Remove an existing user.
  
| Parameter | Data Type | Mandatory? |
| --------- | --------- | --------- |
| uid | string | Yes |
| purge-data | boolean | No |


### getUserList(parameters)
List users
  
| Parameter | Data Type | Mandatory? |
| --------- | --------- | --------- |


### createSubUser(parameters)
Create a new subuser (primarily useful for clients using the Swift API). Note that either gen-subuser or subuser is required for a valid request. Note that in general for a subuser to be useful, it must be granted permissions by specifying access. As with user creation if subuser is specified without secret, then a secret key will be automatically generated.
  
| Parameter | Data Type | Mandatory? |
| --------- | --------- | --------- |
| uid | string | Yes |
| subuser | string | No |
| key-type | string | No |
| secret-key | string | No |
| access | string | No |
| generate-secret | boolean | No |


### updateSubUser(parameters)
Modify an existing subuser
  
| Parameter | Data Type | Mandatory? |
| --------- | --------- | --------- |
| uid | string | Yes |
| subuser | string | Yes |
| key-type | string | No |
| secret-key | string | No |
| access | string | No |
| generate-secret | boolean | No |


### deleteSubUser(parameters)
Remove an existing subuser
  
| Parameter | Data Type | Mandatory? |
| --------- | --------- | --------- |
| uid | string | Yes |
| subuser | string | Yes |
| purge-keys | boolean | No |


### createKey(parameters)
Create a new key. If a subuser is specified then by default created keys will be swift type. If only one of access-key or secret-key is provided the committed key will be automatically generated, that is if only secret-key is specified then access-key will be automatically generated. By default, a generated key is added to the keyring without replacing an existing key pair. If access-key is specified and refers to an existing key owned by the user then it will be modified. The response is a container listing all keys of the same type as the key created. Note that when creating a swift key, specifying the option access-key will have no effect. Additionally, only one swift key may be held by each user or subuser.
  
| Parameter | Data Type | Mandatory? |
| --------- | --------- | --------- |
| uid | string | Yes |
| subuser | string | No |
| key-type | string | No |
| access-key | string | No |
| secret-key | string | No |
| generate-key | boolean | No |


### deleteKey(parameters)
Remove an existing key.
  
| Parameter | Data Type | Mandatory? |
| --------- | --------- | --------- |
| access-key | string | Yes |
| uid | string | No |
| subuser | string | No |
| key-type | string | No |


### getBucketInfo(parameters)
Get information about a subset of the existing buckets. If uid is specified without bucket then all buckets beloning to the user will be returned. If bucket alone is specified, information for that particular bucket will be retrieved.
  
| Parameter | Data Type | Mandatory? |
| --------- | --------- | --------- |
| uid | string | No |
| bucket | string | No |
| stats | boolean | No |


### deleteBucket(parameters)
Delete an existing bucket.
  
| Parameter | Data Type | Mandatory? |
| --------- | --------- | --------- |
| bucket | string | Yes |
| purge-objects | boolean | No |


### getBucketIndex(parameters)
Check the index of an existing bucket. NOTE: to check multipart object accounting with check-objects, fix must be set to True.
  
| Parameter | Data Type | Mandatory? |
| --------- | --------- | --------- |
| bucket | string | Yes |
| check-objects | boolean | No |
| fix | boolean | No |


### unlinkBucket(parameters)
Unlink a bucket from a specified user. Primarily useful for changing bucket ownership.
  
| Parameter | Data Type | Mandatory? |
| --------- | --------- | --------- |
| uid | string | Yes |
| bucket | string | Yes |


### linkBucket(parameters)
Link a bucket to a specified user, unlinking the bucket from any previous user.
  
| Parameter | Data Type | Mandatory? |
| --------- | --------- | --------- |
| uid | string | Yes |
| bucket | string | Yes |


### deleteObject(parameters)
Remove an existing object. NOTE: Does not require owner to be non-suspended.
  
| Parameter | Data Type | Mandatory? |
| --------- | --------- | --------- |
| bucket | string | Yes |
| object | string | Yes |


### getBucketPolicy(parameters)
Read the policy of a bucket.
  
| Parameter | Data Type | Mandatory? |
| --------- | --------- | --------- |
| bucket | string | Yes |
| object | string | No |


### getObjectPolicy(parameters)
Read the policy of an object.
  
| Parameter | Data Type | Mandatory? |
| --------- | --------- | --------- |
| bucket | string | Yes |
| object | string | Yes |


### createUserCapability(parameters)
Add an administrative capability to a specified user.
  
| Parameter | Data Type | Mandatory? |
| --------- | --------- | --------- |
| uid | string | Yes |
| user-caps | string | Yes |


### deleteUserCapability(parameters)
Remove an administrative capability from a specified user.
  
| Parameter | Data Type | Mandatory? |
| --------- | --------- | --------- |
| uid | string | Yes |
| user-caps | string | Yes |


### getUserQuota(parameters)
Read the quota of an user.
  
| Parameter | Data Type | Mandatory? |
| --------- | --------- | --------- |
| uid | string | Yes |


### updateUserQuota(parameters)
Update the quota of an user.
  
| Parameter | Data Type | Mandatory? |
| --------- | --------- | --------- |
| uid | string | Yes |
| quotaObject | string | Yes |


### getBucketQuota(parameters)
Read the quota of a bucket.
  
| Parameter | Data Type | Mandatory? |
| --------- | --------- | --------- |
| uid | string | Yes |


### updateBucketQuota(parameters)
Update the quota of a bucket.
  
| Parameter | Data Type | Mandatory? |
| --------- | --------- | --------- |
| uid | string | Yes |
| quotaObject | string | Yes |

### createBucket(parameters)
create bucket  s3.create

| Parameter | Data Type | Mandatory? |
| --------- | --------- | --------- |
| name | string | Yes |
| acl | string | No |