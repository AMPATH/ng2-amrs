import MysqlConnectionService from './mysql-connection.service';
export default class QueryService {
    executeQuery(sqlString, params) {
        return MysqlConnectionService.getPool().query(sqlString, params);
    }
}