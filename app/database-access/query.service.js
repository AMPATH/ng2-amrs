import MysqlConnectionService from './mysql-connection.service';
export default class QueryService {
  constructor() {}
  executeQuery(sqlString, params) {
    return MysqlConnectionService.getPool().query(sqlString, params);
  }
}
