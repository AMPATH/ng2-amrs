"use strict";
//Db settings
module.exports = function() {
	return {
				mysqlPoolSettings: {
			    	connectionLimit : 10,
        			host: 'test1.ampath.or.ke',
        			port: '3306',
        			user: 'werick',
        			password: 'werick'
    			},
    			sslSettings: {
        			key:'/opt/etl/etl_rest_server/conf/ampath.or.ke.key',
        			crt:'/opt/etl/etl_rest_server/conf/ampath.or.ke.crt'
   				}
		};

}();