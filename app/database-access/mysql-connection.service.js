import ConfigService from '../config/config.service';
const mysql = require('promise-mysql');

const MysqlConnectionService = {
    getPool: () => {
        return mysql.createPool(ConfigService.getConfig().mysql);
    }
}

Object.freeze(MysqlConnectionService);
export default MysqlConnectionService;