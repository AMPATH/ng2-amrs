[![Build Status](https://travis-ci.org/AMPATH/etl-rest-server.svg?branch=master)](https://travis-ci.org/AMPATH/etl-rest-server)

ETL Rest Server
===============

This is node project using hapi to expose rest endpoints providing access to data hosted in ETL flat tables (The tables themselves are flattened derived tables containing data from OpenMRS). There is a separate etl project that is responsible for data generation. You can find the scripts [Here](https://github.com/AMPATH/etl). The project is currently being battle tested in [ng-amrs](https://github.com/AMPATH/ng-amrs).

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

Using Docker Compose 1.6+
-------------------------

    docker-compose up -d

Confirm by looking for the server at host port 8002 using TLS:

    curl -k https://docker:8007

Without Docker Compose
----------------------

## Building

    docker build -t etl .

## Running

### Using Docker for MySQL

    docker run -d --name mysql4etl -e MYSQL_ROOT_PASSWORD=supersecret \
      -e MYSQL_USER=etl_user -e MYSQL_PASSWORD=etl_password mysql

#### Running with openmrs instance running at localhost on port 8080
    docker run -d --name etl --link mysql4etl:db -p 8002:8002 etl

#### Running with openmrs running at 1.2.3.4 on port 8081 under app name "omrs"

    docker run -d --name etl --link mysql4etl:db -p 8002:8002 \
      -e OPENMRS_HOST_ADDR=1.2.3.4 -e OPENMRS_NAME=omrs -e OPENMRS_PORT=8081 etl     

### Using your own MySQL server

If you have MySQL running at 1.2.3.4 with username "myuser" and password "mypassword":
(This assumes openmrs at localhost port 8080, to use different settings pass 
  environmental variables as above)
  
    docker run -d --name etl \
      -e DB_PORT_3306_TCP_ADDR=1.2.3.4 -e DB_PORT_3306_TCP_PORT=3306 \
      -e MYSQL_USER=myuser -e MYSQL_PASSWORD=mypassword \
      -p 8002:8002 etl

### Using custom SSL certificate

    docker run -d -name etl -v /path/to/keys/:/keys -p 8002:8002 etl

The folder /path/to/keys/ should contain SSL certificate and private key in `server.crt` 
and `server.key`.

### Setup CI Integration
1. Request addition of your dockerhub account to ampathke docker team
2. Activate etl-rest-server repo on your travis account
3. Setup DOCKER_PASSWORD & DOCKER_USERNAME on travis fork account.
4. Update local etl-rest-server i.e git pull upstream master. CD setup should be in master
5. Checkout a branch from master e.g - git checkout -b test-etl-test-brach
6. Push etl branch i.e git push origin  <Branchname>
7. Access build using the following url https://ngx.ampath.or.ke/etl-backend/<Branchname> 
where Branchname is the pushed branch.
