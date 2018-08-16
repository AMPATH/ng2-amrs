/*jshint -W003, -W097, -W117, -W026 */
'use strict';
var _ = require('underscore');
module.exports = function () {

    return {
        getReportParams: function getReportParams(reportName, whereClause, queryParams) {
            let whereParams = [];

            // format dates to avoid timezone errors
            queryParams.startDate = (queryParams.startDate || new Date().toISOString().substring(0, 10)).split('T')[0];
            queryParams.endDate = (queryParams.endDate || new Date().toISOString().substring(0, 10)).split('T')[0];
            queryParams.referenceDate = (queryParams.referenceDate || new Date().toISOString().substring(0, 10)).split('T')[0];

            // format cohort filters
            queryParams.startAge = queryParams.startAge || 0;
            queryParams.endAge = queryParams.endAge || 150;
            queryParams.gender = (queryParams.gender || 'M,F').split(',');
            queryParams.genders = (queryParams.genders || 'M,F').split(',');

            // resolve requested indicators parameter name
            queryParams.requestIndicators = queryParams.indicators;

            // format location TODO: Remove location ids on reports and params in order to avoid resolutions
            var locations = [];
            if (queryParams.locations) {
                _.each(queryParams.locations.split(','), function (loc) {
                    locations.push(Number(loc));
                });
                queryParams.locations = locations;
            }

            // format locationUuids
            var locationUuids = [];
            if (queryParams.locationUuids) {
                _.each(queryParams.locationUuids.split(','), function (loc) {
                    if (loc == '' || loc == 'undefined' || loc == undefined) {
                        console.log(loc);
                    } else {
                        locationUuids.push(String(loc));
                    }

                });

                if (locationUuids.length > 0) {
                    queryParams.locationUuids = locationUuids;
                } else {
                    delete queryParams['locationUuids'];
                }

            }
            // format programUuids
            var programUuids = [];
            if (queryParams.programUuids) {
                _.each(queryParams.programUuids.split(','), function (program) {
                    programUuids.push(String(program));
                });
                queryParams.programUuids = programUuids || ["*"];
            }
            var stateUuids = [];
            if (queryParams.stateUuids) {
                _.each(queryParams.stateUuids.split(','), function (state) {
                    stateUuids.push(String(state));
                });
                queryParams.stateUuids = stateUuids || ["*"];
            }

            var providerUuids = [];
            if (queryParams.providerUuids) {
                _.each(queryParams.providerUuids.split(','), function (provider) {
                    if (provider == '' || provider == 'undefined' || provider == undefined) {
                        console.log(provider);
                    } else {
                        providerUuids.push(String(provider));
                    }

                });

                if (providerUuids.length > 0) {
                    queryParams.providerUuids = providerUuids
                } else {
                    delete queryParams['providerUuids'];
                }


            }
            // format conceptUuid
            var conceptUuids = [];
            if (queryParams.conceptUuids) {
                _.each(queryParams.conceptUuids.split(','), function (state) {
                    conceptUuids.push(String(state));
                });
                queryParams.conceptUuids = conceptUuids;
            }
            //
            for (let filter of whereClause) {
                whereParams.push({
                    "name": filter,
                    "value": queryParams[filter]
                });
            }
            var reportParams = {
                reportName: reportName,
                whereParams: whereParams,
                countBy: queryParams.countBy || 'num_persons',
                groupBy: queryParams.groupBy || 'groupByLocation',
                offset: queryParams.startIndex,
                limit: queryParams.limit,
                requestIndicators: queryParams.indicators,
                requestParams: queryParams
            }
            return reportParams;
        },
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
            return {
                s: s,
                vals: vals
            };
        },
        getConceptName: function getConceptName(code) {
            if (code === null || code === undefined) return "";
            var concepts = {
                221: "RHEUMATIC HEART DISEASE",
                664: "NEGATIVE",
                703: "POSITIVE",
                1115: "NORMAL",
                1116: "ABNORMAL",
                1118: "NOT DONE",
                1136: "PULMONARY EFFUSION",
                1137: "MILIARY CHANGES",
                1138: "INDETERMINATE",
                1304: "POOR SAMPLE QUALITY",
                1530: "CARDIAC ARRHYTHMIA",
                1531: "ATRIAL FIBRILLATION",
                1532: "LEFT VENTRICULAR HYPERTROPHY",
                1533: "RIGHT VENTRICULAR HYPERTROPHY",
                1538: "DILATED CARDIOMYOPATHY",
                1539: "PERICARDIAL EFFUSION",
                1540: "MURAL THROMBI",
                1541: "PULMONARY HYPERTENSION",
                1542: "VENTRICULAR SEPTAL DEFECT",
                5158: "EVIDENCE OF CARDIAC ENLARGEMENT",
                5622: "OTHER NON-CODED",
                6049: "INFILTRATE",
                6050: "DIFFUSE NON-MILIARY CHANGES",
                6052: "CAVITARY LESION"
            };
            return concepts[code];
        },
        getARVNames: function getARVNames(str) {
            if (str === null || str === undefined || str === 'unknown' || str === '-1') {
                return "";
            }
            var arvs = {
                625: { mapped_to_ids: "625", name: "STAVUDINE" },
                628: { mapped_to_ids: "628", name: "LAMIVUDINE" },
                630: { mapped_to_ids: "628;797", name: "ZIDOVUDINE AND LAMIVUDINE" },
                631: { mapped_to_ids: "631", name: "NEVIRAPINE" },
                633: { mapped_to_ids: "633", name: "EFAVIRENZ" },
                635: { mapped_to_ids: "635", name: "NELFINAVIR" },
                749: { mapped_to_ids: "749", name: "INDINAVIR" },
                791: { mapped_to_ids: "791", name: "EMTRICITABINE" },
                792: { mapped_to_ids: "625;628;631", name: "STAVUDINE LAMIVUDINE AND NEVIRAPINE" },
                794: { mapped_to_ids: "794", name: "LOPINAVIR AND RITONAVIR" },
                795: { mapped_to_ids: "795", name: "RITONAVIR" },
                796: { mapped_to_ids: "796", name: "DIDANOSINE" },
                797: { mapped_to_ids: "797", name: "ZIDOVUDINE" },
                802: { mapped_to_ids: "802", name: "TENOFOVIR" },
                814: { mapped_to_ids: "814", name: "ABACAVIR" },
                817: { mapped_to_ids: "628;797;814", name: "ABACAVIR LAMIVUDINE AND ZIDOVUDINE" },
                1065: { mapped_to_ids: "1065", name: "YES" },
                1066: { mapped_to_ids: "1066", name: "NO" },
                1107: { mapped_to_ids: "1107", name: "NONE" },
                1400: { mapped_to_ids: "628;802", name: "LAMIVUDINE AND TENOFOVIR" },
                5424: { mapped_to_ids: "5424", name: "OTHER ANTIRETROVIRAL DRUG" },
                5811: { mapped_to_ids: "5811", name: "UNKNOWN ANTIRETROVIRAL DRUG" },
                6156: { mapped_to_ids: "6156", name: "RALTEGRAVIR" },
                6157: { mapped_to_ids: "6157", name: "DARUNAVIR" },
                6158: { mapped_to_ids: "6158", name: "ETRAVIRINE" },
                6159: { mapped_to_ids: "6159", name: "ATAZANAVIR" },
                6160: { mapped_to_ids: "795;6159", name: "ATAZANAVIR AND RITONAVIR" },
                6180: { mapped_to_ids: "791;802", name: "EMTRICITABINE AND TENOFOVIR" },
                6467: { mapped_to_ids: "628;631;633", name: "NEVIRAPINE LAMIVUDINE AND ZIDOVUDINE" },
                6679: { mapped_to_ids: "628;814", name: "ABACAVIR AND LAMIVUDINE" },
                6964: { mapped_to_ids: "628;633;802", name: "TENOFOVIR AND LAMIVUDINE AND EFAVIRENZ" },
                6965: { mapped_to_ids: "625;628", name: "LAMIVUDINE AND STAVUDINE" },
                9435: { mapped_to_ids: "9435", name: "EVIPLERA" },
                9759: { mapped_to_ids: "9759", name: "DOLUTEGRAVIR" },
                9759: { mapped_to_ids: "9026", name: "LOPINAVIR" }
            };
            var arvCodes = str.split(" ## ");
            var arvNames = [];
            var sortedArvCodes = arvCodes.sort().join(';');
            var matchingName = _.find(arvs, function (arv) {
                if (arv["mapped_to_ids"] === sortedArvCodes) {
                    return arv;
                }

            });
            _.each(arvCodes, function (code) {
                if (arvs[code]) {
                    arvNames.push(arvs[code].name);
                } else {
                    arvNames.push(code);
                }

            });
            return matchingName ? matchingName.name : arvNames.join(', ');
        },

        getTestsOrderedNames: function getTestsOrderedNames(str) {
            if (str === null || str === undefined) return "";
            var tests = {
                678: "WBC",
                21: "Hb",
                790: "Cr",
                654: "ALT",
                653: "AST",
                5497: "CD4",
                730: "CD4%",
                856: "Viral Load",
                1040: "Rapid HIV",
                1030: "HIV DNA PCR",
                2323: "TB PCR",
                2311: "Sputum Culture",
                307: "Sputum AFB",
                8064: "Sputum Gene Xpert",
                8070: "MTB Finding",
                8071: "RIF Resistant Finding",
                299: "VDRL",
                729: "Platelets",
                851: "MCV",
                12: "Chest Xray",
                1019: "Complete Blood Count",
                657: "CD4 PANEL",
                6126: "HbA1c",
                887: "RBS",
                6252: "FBS",
                1537: "EKG",
                857: "UREA"


            };
            var testsCodes = str.toString().split(" ## ");
            var testsNames = [];
            _.each(testsCodes, function (code) {
                testsNames.push(tests[code]);
            });
            return testsNames.join(",");
        },

        resolvedLabOrderErrors: function resolvedLabOrderErrors(vlerror, cd4eror, pcrerror) {
            var message = '';

            if (vlerror === 1)
                message = 'Error processing Viral Load';
            if (cd4eror === 1) {
                if (message !== '')
                    message = message + ', ' + 'Error processing cd4';
                else
                    message = 'Error processing cd4';
            }

            if (pcrerror === 1) {

                if (message !== '')
                    message = message + ', ' + 'Error processing hiv dna pcr';
                else
                    message = 'Error processing hiv dna pcr';
            }

            return message

        },

        buildWhereClauseForDataEntryIndicators: function buildWhereClauseForDataEntryIndicators(queryParams, where) {
            if (queryParams.locations) {
                var locations = [];
                _.each(queryParams.locations.split(','), function (loc) {
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
                _.each(queryParams.encounterTypeIds.split(','), function (encType) {
                    encounterTypes.push(Number(encType));
                });
                where[0] = where[0] + " and t2.encounter_type in ?";
                where.push(encounterTypes);
            }
            if (queryParams.formIds) {
                var formIds = [];
                _.each(queryParams.formIds.split(','), function (formid) {
                    formIds.push(Number(formid));
                });
                where[0] = where[0] + " and t2.form_id in ?";
                where.push(formIds);
            }
        },
        decodeBase64Image: function decodeBase64Image(dataString) {
            var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
                response = {};

            if (matches.length !== 3) {
                return new Error('Invalid input string');
            }

            response.type = matches[1];
            response.data = new Buffer(matches[2], 'base64');

            return response;
        },
        buildWhereParamsDataEntryIndicators: function buildWhereParamsDataEntryIndicators(queryParams, where) {
            if (queryParams.locations) {
                var locations = [];
                _.each(queryParams.locations.split(','), function (loc) {
                    locations.push(Number(loc));
                });
                where.locations = locations;
            }
            if (queryParams.provideruuid) {
                where.providerUuid = queryParams.provideruuid;
            }
            if (queryParams.creatoruuid) {
                var creatorUuids = [];
                _.each(queryParams.creatoruuid.split(','), function (creator) {
                    creatorUuids.push(creator);
                });
                where.creator = creatorUuids;
            }
            if (queryParams.encounterTypeIds) {
                var encounterTypes = [];
                _.each(queryParams.encounterTypeIds.split(','), function (encType) {
                    encounterTypes.push(Number(encType));
                });
                where.encounterTypes = encounterTypes;
            }
            if (queryParams.formIds) {
                var formIds = [];
                _.each(queryParams.formIds.split(','), function (formid) {
                    formIds.push(Number(formid));
                });
                where.formIds = formIds;
            }
        }
    };

}();
