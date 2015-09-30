
"use strict";
// var dao = require('./etl-dao');
var db = require('./etl-db');
var dao = require('./etl-dao');
var _ = require('underscore');
console.log('modules');
console.log('+++++Test Dao', db)

module.exports = function() {
	//order=columname|asc,columnName|desc
var getSortOrder = function(param) {
    if(!param) return null;
    var parts;
    var order = [];
    _.each(param.split(','),function(order_by) {
        parts = order_by.split('|');
        order.push({column:parts[0],asc:(parts[1].toLowerCase() === "asc")});
    })
    return order;
}

var getFilters = function(filters) {
    var s="";
    var vals = [],column;
     _.each(filters,function(item) {
         column = item.column;
         for(var f in item.filters) {
             if(item.filters[f] === undefined || item.filters[f] === null || item.filters[f] === "") continue;
             console.log(item.filters[f]);
             s += column;
             if(f === "start") s += " >= ?";
             else if(f === "end") s += " <= ?";
             else s+= " like ?"
             vals.push(item.filters[f]);
             s += " AND "
         }
     });
    s = s.substring(0, s.length-5)
    if(s !== "")
        s = "(" + s + ")";
    console.log(s);
    console.log(vals);
    return {s:s,vals:vals};
}

	return [
		{
			method: 'GET',
			path: '/',
			config : {
				handler: function (request, reply) {
        			reply('Hello, World! HAPI Demo Server');
    			}

			}
		},
		{
            method: 'GET',
            path: '/etl/patient/{uuid}',
            config: {
                //auth: 'simple',
                handler: function (request, reply) {
                    console.log('Gettting Here',request.query)
                    var uuid = request.params.uuid;
                    var order = getSortOrder(request.query.order);

                    var queryParts = {
                        columns : request.query.fields || "*",
                        table:"etl.flat_hiv_summary",
                        where:["uuid = ?",uuid],
                        order: order || [{column:'encounter_datetime',asc:false}],
                        offset:request.query.startIndex,
                        limit:request.query.limit
                    }

                    db.queryServer_test(queryParts,reply);
                }
            }
        },
		{
            method: 'GET',
            path: '/etl/patient/{uuid}/vitals',
            config: {
                // auth: 'simple',
                handler: function (request, reply) {
                    var uuid = request.params.uuid;
                    var order = getSortOrder(request.query.order);
                    console.log('test  ', request.query)
                    request.query.page;
                    request.query.pageSize;

                    var queryParts = {
                        columns : request.query.fields || "*",
                        table:"etl.flat_vitals",
                        where:["uuid = ?",uuid],
                        order: order || [{column:'encounter_datetime',asc:false}],
                        offset:request.query.startIndex,
                        limit:request.query.limit
                    }

                    db.queryServer_test(queryParts,reply);
                }
            }
        },
		{
            method: 'GET',
            path: '/etl/patient/{uuid}/data',
            config: {
                auth: 'simple',
                handler: function (request, reply) {
                    var uuid = request.params.uuid;
                    var order = getSortOrder(request.query.order);

                    var queryParts = {
                        columns : request.query.fields || "*",
                        table:"etl.flat_labs_and_imaging",
                        where:["uuid = ?",uuid],
                        order: order || [{column:'encounter_datetime',asc:false}],
                        offset:request.query.startIndex,
                        limit:request.query.limit
                    }

                    db._queryServer_test(queryParts,reply);
                }
            }
        },
		{
            method: 'GET',
            path: '/etl/patient/{uuid}/hiv-summary',
            config: {
                // auth: 'simple',
                handler: function (request, reply) {
					dao.getPatientHivSummary(request, reply);
                }
            }
        },
		{
            method: 'GET',
            path: '/etl/location/{uuid}/clinic-encounter-data',
            config: {
                auth: 'simple',
                handler: function (request, reply) {
                    dao.getClinicEncounterData(request, reply);
                }
            }
        },
        {
            method: 'GET',
            path: '/etl/location/{uuid}/hiv-summary-indicators',
            config: {
                // auth: 'simple',
                handler: function (request, reply) {
                    dao.getClinicHivSummayIndicators(request, reply);
                }
            }
        },
        {
            method: 'GET',
            path: '/etl/location/{uuid}/appointment-schedule',
            config: {
                // auth: 'simple',
                handler: function (request, reply) {
                    dao.getClinicAppointmentSchedule(request, reply);
                }
            }
        },
        {
            method: 'GET',
            path: '/etl/location/{uuid}/monthly-appointment-schedule',
            config: {
                // auth: 'simple',
                handler: function (request, reply) {
                    dao.getClinicMonthlyAppointmentSchedule(request, reply);
                }
            }
        },
        {
            method: 'GET',
            path: '/etl/location/{uuid}/defaulter-list',
            config: {
                // auth: 'simple',
                handler: function (request, reply) {
                    dao.getClinicDefaulterList(request, reply);
                }
            }
        },
        {
            method: 'GET',
            path: '/etl/custom_data/{userParams*3}',
            config: {
                // auth: 'simple',
                handler: function (request, reply) {
                    dao.getCustomData(request, reply);
                    
                }
            }
        }
	];
}();
