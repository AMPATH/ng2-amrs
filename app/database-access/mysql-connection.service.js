import ConfigService from '../config/config.service';
const mysql = require('promise-mysql');
let connectionPool = undefined;
let MysqlConnectionService = {
  getPool: () => {
    if (connectionPool !== undefined) {
      return connectionPool;
    }
    console.log('calling connection pool');
    connectionPool = mysql.createPool(ConfigService.getConfig().mysql);
    return connectionPool;
  }
};

Object.freeze(MysqlConnectionService);
export default MysqlConnectionService;
