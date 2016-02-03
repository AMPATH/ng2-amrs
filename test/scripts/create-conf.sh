#!/bin/bash
set -ev
mkdir conf

echo 'module.exports = {
    mysqlPoolSettings: {
        connectionLimit : 10,
        host: "test",
        port: "0000",
        user: "user",
        password: "password"
    },
    sslSettings: {
        key:"server.key",
        crt:"server.crt"
    }
}' > conf/settings.js
