/*jshint -W003, -W097, -W117, -W026 */
'use strict';
var _ = require('underscore');
module.exports = function () {

    return {
        getSortOrder: function getSortOrder(param) {
            if (!param) return null;
            var parts;
            var order = [];
            _.each(param.split(','), function (order_by) {
                parts = order_by.split('|');
                order.push({
                    column: parts[0],
                    asc: (parts[1].toLowerCase() === "asc")
                });
            });
            return order;
        },
        getFilters: function getFilters(filters) {
            var s = "";
            var vals = [],
                column;
            _.each(filters, function (item) {
                column = item.column;
                for (var f in item.filters) {
                    if (item.filters[f] === undefined || item.filters[f] === null || item.filters[f] === "") continue;
                    console.log(item.filters[f]);
                    s += column;
                    if (f === "start") s += " >= ?";
                    else if (f === "end") s += " <= ?";
                    elses += " like ?";
                    vals.push(item.filters[f]);
                    s += " AND ";
                }
            });
            s = s.substring(0, s.length - 5)
            if (s !== "")
                s = "(" + s + ")";
            console.log(s);
            console.log(vals);
            return {s: s, vals: vals};
        },

        getARVNames: function getARVNames(str) {
            if (str === null || str === undefined) return "";
            var arvs = {
                814: "ABACAVIR",
                817: "ABACAVIR LAMIVUDINE AND ZIDOVUDINE",
                6159: "ATAZANAVIR",
                6160: "ATAZANAVIR AND RITONAVIR",
                796: "DIDANOSINE",
                633: "EFAVIRENZ",
                791: "EMTRICITABINE",
                6679: "EPZICOM",
                6158: "ETRAVIRINE",
                749: "INDINAVIR",
                6156: "ISENTRESS",
                6965: "LAMIVIR S30",
                628: "LAMIVUDINE",
                1400: "LAMIVUDINE AND TENOFOVIR",
                794: "LOPINAVIR AND RITONAVIR",
                635: "NELFINAVIR",
                631: "NEVIRAPINE",
                6467: "NEVIRAPINE LAMIVUDINE AND ZIDOVUDINE",
                1107: "NONE",
                5424: "OTHER ANTIRETROVIRAL DRUG",
                6157: "PREZISTA",
                795: "RITONAVIR",
                625: "STAVUDINE",
                792: "STAVUDINE LAMIVUDINE AND NEVIRAPINE",
                6964: "TDF AND 3TC AND EFV",
                802: "TENOFOVIR",
                6180: "TRUVADA",
                5811: "UNKNOWN ANTIRETROVIRAL DRUG",
                797: "ZIDOVUDINE",
                630: "ZIDOVUDINE AND LAMIVUDINE"
            };
            var arvCodes = str.split(" ## ");
            var arvNames = [];
            _.each(arvCodes, function (code) {
                arvNames.push(arvs[code]);
            });
            return arvNames.join(', ');
        },
        buildWhereClauseForDataEntryIndicators: function buildWhereClauseForDataEntryIndicators(queryParams, where) {
        if (queryParams.locations) {
            var locations = [];
            _.each(queryParams.locations.split(','), function(loc) {
                locations.push(Number(loc));
            });
            where[0] = where[0] + " and t2.location_id in ?";
            where.push(locations);
        }
        if (queryParams.provideruuid) {
            where[0] = where[0] + " and t4.uuid = ?";
            where.push(queryParams.provideruuid);
        }
        if (queryParams.creatoruuid) {
            where[0] = where[0] + " and t5.uuid = ?";
            where.push(queryParams.creatoruuid);
        }
        if (queryParams.encounterTypeIds) {
            var encounterTypes = [];
            _.each(queryParams.encounterTypeIds.split(','), function(encType) {
                encounterTypes.push(Number(encType));
            });
            where[0] = where[0] + " and t2.encounter_type in ?";
            where.push(encounterTypes);
        }
        if (queryParams.formIds) {
            var formIds = [];
            _.each(queryParams.formIds.split(','), function(formid) {
                formIds.push(Number(formid));
            });
            where[0] = where[0] + " and t2.form_id in ?";
            where.push(formIds);
        }
    }
    }
}();
