[![Build Status](https://travis-ci.org/AMPATH/etl-rest-server.svg?branch=master)](https://travis-ci.org/AMPATH/etl-rest-server)

This is node project using hapi to expose rest endpoints providing access to data hosted in ETL flat tables (The tables themselves are flattened derived tables containing data from OpeMRS). There is a separate etl project that is responsible for data generation. You can find the scripts [Here](https://github.com/AMPATH/etl). The project is currently being battle tested in [ng-amrs](https://github.com/AMPATH/ng-amrs).

To setup the project run

```$ git clone https://github.com/AMPATH/etl-rest-server.git```

```$ cd etl-rest-server ```

```$ npm install```

```$ mkdir conf && cd conf```

Create a config.json file

```$ cat config.json```

With the following content

```json
{
  "openmrs": {
    "host": "The IP or hostname of the OpenMRS server",
    "port": 8080
  },
  "etl": {
    "host": "The IP or hostname of the server running etl-rest-server",
    "port": 8002,
    "key": "path to the private key for tls",
    "cert": "path to the public key for tls",
    "tls": true
  },
  "mysql": {
    "connectionLimit": 10,
    "host": "The IP or hostname of the  mysql server",
    "port": "3306",
    "user": "<mysql user>",
    "password": "<mysql password>",
    "multipleStatements": true
  }
}

```
You can set ```tls:false``` if you don't care about https and don't provide the keys but if you set
it to true you have to provide the keys.

```npm start```

Now visit ```https://<Your Host>:<Your Port>``` You should see the welcome message

``` Welcome to ETL reset server for OpenMRS ```
