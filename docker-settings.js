module.exports = {
  openmrs: {
    host: process.env.OPENMRS_HOST_ADDR || 'localhost',
    applicationName: process.env.OPENMRS_NAME || 'openmrs',
    port: process.env.OPENMRS_PORT || 8080
  },
  etl: {
    host: '0.0.0.0',
    port: 8002,
    tls: true,
    key: '/keys/server.key', // Server Key
    cert: '/keys/server.crt' // Certificate to allow TLS access to the server
  },
  mysql: {
    connectionLimit: 10,
    host: process.env.DB_PORT_3306_TCP_ADDR || 'localhost',
    port: process.env.DB_PORT_3306_TCP_PORT || 3306,
    user: process.env.DB_ENV_MYSQL_USER || 'etl',
    password: process.env.DB_ENV_MYSQL_PASSWORD || 'etl',
    multipleStatements: true
  }
};
