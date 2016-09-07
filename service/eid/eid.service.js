(function () {
    'use strict';
    var _ = require('underscore');
    var moment = require('moment');
    var eidFacilityMap = require('../eid/eid-facility-mappings');
    var eidOrderMap = require('../eid/eid-order-mappings');
    var config = require('../../conf/config');


    function generatePayloadByOrderType(rawPayload, callback, failback) {
        //now generate the payload
        switch (rawPayload.type) {
            case 'DNAPCR':
                callback({
                    "mflCode": getLocation(rawPayload, 'mflCode'),
                    "mrsLocation": getLocation(rawPayload, 'mrsId'),
                    "mrsOrderNumber": rawPayload.orderNumber,
                    "providerIdentifier": rawPayload.providerIdentifier,
                    "patientName": rawPayload.patientName,
                    "patientId": rawPayload.patientIdentifier,
                    "sex": rawPayload.sex,
                    "birthdate": rawPayload.birthDate,
                    "dateDrawn": rawPayload.dateDrawn,
                    "dateReceived": rawPayload.dateReceived,
                    "receivedStatus": 1,
                    "infantProphylaxis": getInfantProphylaxis(rawPayload) || 5,
                    "pmtctIntervention": getPmtctIntervention(rawPayload) || 5,
                    "feedingType": getInfantFeedingPlan(rawPayload) || 0,
                    "entryPoint": getDnaPcrEntryPoint(rawPayload) || 0,
                    "motherHivStatus": getHivStatus(rawPayload) || 0,
                    "numberOfSpots": 1
                });
                break;
            case 'VL':
                callback({
                    "mflCode": getLocation(rawPayload, 'mflCode'),
                    "mrsLocation": getLocation(rawPayload, 'mrsId'),
                    "mrsOrderNumber": rawPayload.orderNumber,
                    "providerIdentifier": rawPayload.providerIdentifier,
                    "patientName": rawPayload.patientName,
                    "patientId": rawPayload.patientIdentifier,
                    "sex": rawPayload.sex,
                    "birthdate": rawPayload.birthDate,
                    "dateDrawn": rawPayload.dateDrawn,
                    "dateReceived": rawPayload.dateReceived,
                    "receivedStatus": 1,
                    "sampletype": rawPayload.sampleType ? rawPayload.sampleType : 1, //default to 3 to prevent code breaking
                    "artStartDateInitial": rawPayload.artStartDateInitial,
                    "artStartDateCurrent": rawPayload.artStartDateCurrent,
                    "artRegimen": getArtRegimen(rawPayload) || 14,
                    "justification": getTestOrderJustification(rawPayload) || 0

                });
                break;
            case 'CD4':
                callback({
                    "mflCode": getLocation(rawPayload, 'mflCode'),
                    "mrsLocation": getLocation(rawPayload, 'mrsId'),
                    "mrsOrderNumber": rawPayload.orderNumber,
                    "providerIdentifier": rawPayload.providerIdentifier,
                    "patientName": rawPayload.patientName,
                    "patientId": rawPayload.patientIdentifier,
                    "sex": rawPayload.sex.toUpperCase(),
                    "birthdate": rawPayload.birthDate,
                    "dateDrawn": rawPayload.dateDrawn,
                    "dateReceived": rawPayload.dateReceived,
                    "receivedStatus": 1
                });
                break;
            default:
                failback('This type of lab order can not be posted by POC (CD4, DNAPCR and VL can only be processed)');
        }
    }

    function getEidServerUrl(lab, orderType, apiCall) {
        var serverConfig = config.eidServer[lab];
        switch (orderType) {
            case 'DNAPCR':
                return {
                    url: serverConfig.host + ':' + serverConfig.port + serverConfig[apiCall].dnaPcr + 'orders/eid.php',
                    apiKey: serverConfig.apiKey
                };
                break;
            case 'VL':
                return {
                    url: serverConfig.host + ':' + serverConfig.port + serverConfig[apiCall].vl + 'orders/vl.php',
                    apiKey: serverConfig.apiKey
                };
                break;
            case 'CD4':
                return {
                    url: serverConfig.host + ':' + serverConfig.port + serverConfig[apiCall].cd4 + 'orders/cd4.php',
                    apiKey: serverConfig.apiKey
                };
                break;
            default:
                return {
                    url: serverConfig.host + ':' + serverConfig.port + config.eid.generalPath,
                    apiKey: serverConfig.apiKey
                }

        }
    }

    //helpers
    function getInfantProphylaxis(rawPayload) {
        var result = eidOrderMap.infantProphylaxis[rawPayload.infantProphylaxisUuid];
        if (result) return result.eidId;
    }

    function getPmtctIntervention(rawPayload) {
        var result = eidOrderMap.pmtctIntervention[rawPayload.pmtctInterventionUuid];
        if (result) return result.eidId;
    }

    function getInfantFeedingPlan(rawPayload) {
        var result = eidOrderMap.infantFeedingPlan[rawPayload.feedingTypeUuid];
        if (result) return result.eidId;
    }

    function getDnaPcrEntryPoint(rawPayload) {
        var result = eidOrderMap.dnaPcrEntryPoint[rawPayload.entryPointUuid];
        if (result) return result.eidId;
    }

    function getHivStatus(rawPayload) {
        var result = eidOrderMap.hivStatus[rawPayload.motherHivStatusUuid];
        if (result) return result.eidId;
    }

    function getLocation(rawPayload, code) {
        var result = eidFacilityMap[rawPayload.locationUuid];
        if (result) return result[code];
    }

    function getArtRegimen(rawPayload) {
        if (rawPayload.artRegimenUuid === "") return 15; //15 is none;
        var arvCodes = rawPayload.artRegimenUuid.split(" ## ");
        var sumOfArvCodes=0;
        var resolvedId=14;  // 14 is other
        _.each(arvCodes, function (code) {
            sumOfArvCodes=sumOfArvCodes+Number(code);
        });
        _.each(eidOrderMap.artRegimen, function (artRegimen) {
            var sumOfMrsArvRegimen=0;
            _.each(artRegimen.mrsArvRegimen.split(","), function (mrsArvRegimen) {
                sumOfMrsArvRegimen=sumOfMrsArvRegimen+Number(mrsArvRegimen);
            });
            if (Number(sumOfMrsArvRegimen)===Number(sumOfArvCodes)) resolvedId=artRegimen.eidId;
        });
        return resolvedId;
    }

    function getTestOrderJustification(rawPayload) {
        var result = eidOrderMap.testOrderJustification[rawPayload.vlJustificationUuid];
        if (result) return result.eidId;
    }


    module.exports = {
        generatePayload: generatePayloadByOrderType,
        getEidServerUrl: getEidServerUrl
    };

})();
