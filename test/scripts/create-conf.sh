#!/bin/bash
set -ev
mkdir conf

echo '{
  "openmrs": {
    "host": "xxxxxx.zmana.com",
    "port": 8080
  },
  "etl": {
    "host": "master",
    "port": 100000,
    "key": "path to the private key for tls",
    "cert": "path to the public key for tls",
    "tls": false
  },
  "mysql": {
    "connectionLimit": 100000,
    "host": "00000",
    "port": "0000",
    "user": "00000",
    "password": "0000000",
    "multipleStatements": true
  }
}
' > conf/config.json
