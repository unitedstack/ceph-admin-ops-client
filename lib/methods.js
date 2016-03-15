module.exports = {
    getUsage: {
        verb: "GET",
        path: "/usage",
        description: "Request bandwidth usage information.",
        mandatoryParameters: {},
        allowedParameters: {
            "uid": "string",
            "start": "date",
            "end": "date",
            "show-entries": "boolean",
            "show-summary": "boolean"
        }
    },
    trimUsage: {
        verb: "DELETE",
        path: "/usage",
        description: "Remove usage information. With no dates specified, removes all usage information.",
        mandatoryParameters: {},
        allowedParameters: {
            "uid": "string",
            "start": "date",
            "end": "date",
            "remove-all": "boolean",
            "show-summary": "boolean"
        }
    },
    getUserInfo: {
        verb: "GET",
        path: "/user",
        description: "Get user information. If no user is specified returns the list of all users along with suspension information.",
        mandatoryParameters: {
            "uid": "string"
        },
        allowedParameters: {
            "uid": "string"
        }
    },
    createUser: {
        verb: "PUT",
        path: "/user",
        description: "Create a new user. By Default, a S3 key pair will be created automatically and returned in the response. If only one of access-key or secret-key is provided, the omitted key will be automatically generated. By default, a generated key is added to the keyring without replacing an existing key pair. If access-key is specified and refers to an existing key owned by the user then it will be modified.",
        mandatoryParameters: {
            "uid": "string",
            "display-name": "string"
        },
        allowedParameters: {
            "uid": "string",
            "display-name": "string",
            "email": "string",
            "key-type": "string",
            "access-key": "string",
            "secret-key": "string",
            "user-caps": "string",
            "generate-key": "boolean",
            "max-buckets": "number",
            "suspended": "boolean"
        }
    },
    updateUser: {
        verb: "POST",
        path: "/user",
        description: "Modify a user.",
        mandatoryParameters: {
            "uid": "string"
        },
        allowedParameters: {
            "uid": "string",
            "display-name": "string",
            "email": "string",
            "key-type": "string",
            "access-key": "string",
            "secret-key": "string",
            "user-caps": "string",
            "generate-key": "boolean",
            "max-buckets": "number",
            "suspended": "boolean"
        }
    },
    deleteUser: {
        verb: "DELETE",
        path: "/user",
        description: "Remove an existing user.",
        mandatoryParameters: {
            "uid": "string"
        },
        allowedParameters: {
            "uid": "string",
            "purge-data": "boolean"
        }
    },
    createSubUser: {
        verb: "PUT",
        path: "/user",
        description: "Create a new subuser (primarily useful for clients using the Swift API). Note that either gen-subuser or subuser is required for a valid request. Note that in general for a subuser to be useful, it must be granted permissions by specifying access. As with user creation if subuser is specified without secret, then a secret key will be automatically generated.",
        mandatoryParameters: {
            "uid": "string"
        },
        allowedParameters: {
            "uid": "string",
            "subuser": "string",
            "key-type": "string",
            "secret-key": "string",
            "access": "string",
            "generate-secret": "boolean"
        },
        internalParameters: {
            "subuser": "null"
        }
    },
    updateSubUser: {
        verb: "POST",
        path: "/user",
        description: "Modify an existing subuser",
        mandatoryParameters: {
            "uid": "string",
            "subuser": "string"
        },
        allowedParameters: {
            "uid": "string",
            "subuser": "string",
            "key-type": "string",
            "secret-key": "string",
            "access": "string",
            "generate-secret": "boolean"
        }
    },
    deleteSubUser: {
        verb: "DELETE",
        path: "/user",
        description: "Remove an existing subuser",
        mandatoryParameters: {
            "uid": "string",
            "subuser": "string"
        },
        allowedParameters: {
            "uid": "string",
            "subuser": "string",
            "purge-keys": "boolean"
        }
    },
    createKey: {
        verb: "PUT",
        path: "/user",
        description: "Create a new key. If a subuser is specified then by default created keys will be swift type. If only one of access-key or secret-key is provided the committed key will be automatically generated, that is if only secret-key is specified then access-key will be automatically generated. By default, a generated key is added to the keyring without replacing an existing key pair. If access-key is specified and refers to an existing key owned by the user then it will be modified. The response is a container listing all keys of the same type as the key created. Note that when creating a swift key, specifying the option access-key will have no effect. Additionally, only one swift key may be held by each user or subuser.",
        mandatoryParameters: {
            "uid": "string"
        },
        allowedParameters: {
            "uid": "string",
            "subuser": "string",
            "key-type": "string",
            "access-key": "string",
            "secret-key": "string",
            "generate-key": "boolean"
        },
        internalParameters: {
            "key": "null"
        }
    },
    deleteKey: {
        verb: "DELETE",
        path: "/user",
        description: "Remove an existing key.",
        mandatoryParameters: {
            "access-key": "string"
        },
        allowedParameters: {
            "access-key": "string",
            "uid": "string",
            "subuser": "string",
            "key-type": "string"
        },
        internalParameters: {
            "key": "null"
        }
    },
    getBucketInfo: {
        verb: "GET",
        path: "/bucket",
        description: "Get information about a subset of the existing buckets. If uid is specified without bucket then all buckets beloning to the user will be returned. If bucket alone is specified, information for that particular bucket will be retrieved.",
        mandatoryParameters: {},
        allowedParameters: {
            "uid": "string",
            "bucket": "string",
            "stats": "boolean"
        }
    },
    deleteBucket: {
        verb: "DELETE",
        path: "/bucket",
        description: "Delete an existing bucket.",
        mandatoryParameters: {
            "bucket": "string"
        },
        allowedParameters: {
            "bucket": "string",
            "purge-objects": "boolean"
        }
    },
    getBucketIndex: {
        verb: "GET",
        path: "/bucket",
        description: "Check the index of an existing bucket. NOTE: to check multipart object accounting with check-objects, fix must be set to True.",
        mandatoryParameters: {
            "bucket": "string"
        },
        allowedParameters: {
            "bucket": "string",
            "check-objects": "boolean",
            "fix": "boolean"
        },
        internalParameters: {
            "index": "null"
        }
    },
    unlinkBucket: {
        verb: "POST",
        path: "/bucket",
        description: "Unlink a bucket from a specified user. Primarily useful for changing bucket ownership.",
        mandatoryParameters: {
            "uid": "string",
            "bucket": "string"
        },
        allowedParameters: {
            "uid": "string",
            "bucket": "string"
        }
    },
    linkBucket: {
        verb: "PUT",
        path: "/bucket",
        description: "Link a bucket to a specified user, unlinking the bucket from any previous user.",
        mandatoryParameters: {
            "uid": "string",
            "bucket": "string"
        },
        allowedParameters: {
            "uid": "string",
            "bucket": "string"
        }
    },
    deleteObject: {
        verb: "DELETE",
        path: "/bucket",
        description: "Remove an existing object. NOTE: Does not require owner to be non-suspended.",
        mandatoryParameters: {
            "bucket": "string",
            "object": "string"
        },
        allowedParameters: {
            "bucket": "string",
            "object": "string"
        },
        internalParameters: {
            "object": "null"
        }
    },
    getBucketPolicy: {
        verb: "GET",
        path: "/bucket",
        description: "Read the policy of a bucket.",
        mandatoryParameters: {
            "bucket": "string"
        },
        allowedParameters: {
            "bucket": "string",
            "object": "string"
        },
        internalParameters: {
            "policy": "null"
        }
    },
    getObjectPolicy: {
        verb: "GET",
        path: "/bucket",
        description: "Read the policy of an object.",
        mandatoryParameters: {
            "bucket": "string",
            "object": "string"
        },
        allowedParameters: {
            "bucket": "string",
            "object": "string"
        },
        internalParameters: {
            "policy": "null"
        }
    },
    createUserCapability: {
        verb: "PUT",
        path: "/user",
        description: "Add an administrative capability to a specified user.",
        mandatoryParameters: {
            "uid": "string",
            "user-caps": "string"
        },
        allowedParameters: {
            "uid": "string",
            "user-caps": "string"
        },
        internalParameters: {
            "caps": "null"
        }
    },
    deleteUserCapability: {
        verb: "PUT",
        path: "/user",
        description: "Remove an administrative capability from a specified user.",
        mandatoryParameters: {
            "uid": "string",
            "user-caps": "string"
        },
        allowedParameters: {
            "uid": "string",
            "user-caps": "string"
        },
        internalParameters: {
            "caps": "null"
        }
    },
    getUserQuota: {
        verb: "GET",
        path: "/user",
        description: "Read the quota of an user.",
        mandatoryParameters: {
            "uid": "string"
        },
        allowedParameters: {
            "uid": "string"
        },
        internalParameters: {
            "quota": "null",
            "quota-type": "user"
        }
    },
    updateUserQuota: {
        verb: "PUT",
        path: "/user",
        description: "Update the quota of an user.",
        mandatoryParameters: {
            "uid": "string",
            "quotaObject": "string"
        },
        allowedParameters: {
            "uid": "string",
            "quotaObject": "string"
        },
        internalParameters: {
            "quota": "null",
            "quota-type": "user"
        },
        body: {
            parameter: "quotaObject"
        }
    },
    getBucketQuota: {
        verb: "GET",
        path: "/user",
        description: "Read the quota of a bucket.",
        mandatoryParameters: {
            "uid": "string"
        },
        allowedParameters: {
            "uid": "string"
        },
        internalParameters: {
            "quota": "null",
            "quota-type": "bucket"
        }
    },
    updateBucketQuota: {
        verb: "PUT",
        path: "/user",
        description: "Update the quota of a bucket.",
        mandatoryParameters: {
            "uid": "string",
            "quotaObject": "string"
        },
        allowedParameters: {
            "uid": "string",
            "quotaObject": "string"
        },
        internalParameters: {
            "quota": "null",
            "quota-type": "bucket"
        },
        body: {
            parameter: "quotaObject"
        }
    }
};