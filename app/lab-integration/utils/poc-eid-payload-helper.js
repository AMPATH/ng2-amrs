(function () {
    'use strict';
    const _ = require('lodash');
    const eidFacilityMap = require('../../../service/eid/eid-facility-mappings');
    const eidOrderMap = require('./regimen-config-loader');
    const hasEidCode = _.findKey(eidOrderMap.artRegimen, 'eidCode');

    function generatePocToEidPayLoad(payload) {
        console.log('generatePocToEidPayLoad', payload);
        return new Promise(function (resolve, reject) {
            var eidPayload = {
            };

            try {

                switch (payload.type) {
                    case 'VL':
                        eidPayload = {
                            "test": 2,
                            "mflCode": getLocation(payload, 'mflCode'),
                            "patient_identifier": payload.patientIdentifier,
                            "dob": payload.birthDate,
                            "datecollected": payload.dateDrawn,
                            "sex": getGenderCode(payload.sex),
                            "prophylaxis": getArtRegimen(payload) || 16,
                            "regimenline": 1,
                            "order_no": payload.orderNumber,
                            "sampletype": payload.sampleType ? payload.sampleType : 1,
                            "justification": getTestOrderJustification(payload) || 0,
                            "pmtct": payload.isPregnant === 1 ? 1 : payload.breastfeeding === 1 ? 2: 3,
                            "amrs_location": getLocation(payload, 'mrsId')
                        };
                        break;
                    case 'DNAPCR':
                        eidPayload = {
                            "test": 1,
                            "mflCode": getLocation(payload, 'mflCode'),
                            "patient_identifier": payload.patientIdentifier,
                            "dob": payload.birthDate,
                            "datecollected": payload.dateDrawn,
                            "sex": getGenderCode(payload.sex),
                            "feeding": getInfantFeedingPlan(payload) || 0,
                            "pcrtype": "",
                            "regimen": getInfantProphylaxis(payload) || 5,
                            "entry_point": getDnaPcrEntryPoint(payload) || 0,
                            "mother_prophylaxis": getPmtctIntervention(payload) || 5,
                            "mother_last_result": "",
                            "spots": "",
                            "mother_age": "",
                            "order_no": payload.orderNumber,
                            "ccc_no": "",
                            "lab": "",
                            "amrs_location": getLocation(payload, 'mrsId')
                        };
                        break;
                    case 'CD4':
                        eidPayload = {
                            "test": 3,
                            "mflCode": getLocation(payload, 'mflCode'),
                            "dob": payload.birthDate,
                            "datecollected": payload.dateDrawn,
                            "sex": getGenderCode(payload.sex),
                            "patient_name": payload.patientName,
                            "medicalrecordno": payload.patientIdentifier,
                            "order_no": payload.orderNumber,
                            "amrs_location": getLocation(payload, 'mrsId'),
                            "provider_identifier": payload.providerIdentifier
                        };
                        break;
                    default:


                }

                if (!_.isEmpty(eidPayload)) {
                    console.log('payload :', eidPayload);
                    resolve(eidPayload);
                } else {
                    reject('Could not Find payload type');
                }
            } catch (e) {
                reject(e);
            }

        });

    }


    //helpers
    function getInfantProphylaxis(rawPayload) {
        const result = eidOrderMap.infantProphylaxis[rawPayload.infantProphylaxisUuid];
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
        if (result) return hasEidCode ? result.eidCode : result.eidId;
    }

    function getLocation(rawPayload, code) {
        var result = eidFacilityMap[rawPayload.locationUuid];
        if (result) return result[code];
    }

    function getTestOrderJustification(rawPayload) {
        var result = eidOrderMap.testOrderJustification[rawPayload.vlJustificationUuid];
        if (result) return result.eidId;
    }

    function getGenderCode(gender) {
        var genderCode;
        switch (gender) {
            case 'F':
                genderCode = 2;
                break;
            case 'M':
                genderCode = 1;
                break;
            default:
                genderCode = 0;
        }
        return genderCode;

    }

    function hasCode(list, code) {
        let hasCode = false;
        try {
            _.each(list,(item) => {
                if (parseInt(item) === parseInt(code)) {
                    hasCode = true;
                }
            });
        } catch (e) {}
        return hasCode;
    }

    function getArtRegimenEidCode (rawPayload) {
        if (rawPayload.artRegimenUuid === "" || rawPayload.artRegimenUuid === null) return 'AF5X'; // none
        const arvconcepts = rawPayload.artRegimenUuid ? rawPayload.artRegimenUuid.split(" ## ") : null;
        let resolveId = 'AF5X';

        if (!(arvconcepts && arvconcepts.length > 0)) return resolvedId;

        _.forEach(eidOrderMap.artRegimen, (artRegimen) => {

            const mrsArvRegimenList = artRegimen.mrsArvRegimen.split(',');

            if (hasCode(mrsArvRegimenList, arvconcepts[0])) {
                if (_.isEqual(_.sortBy(mrsArvRegimenList), _.sortBy(arvconcepts))) {
                    return resolveId = artRegimen.eidCode;
                }
            }
        });
        return resolveId;
    }

    const getArtRegimen = (rawPayload) => {
        return hasEidCode ? getArtRegimenEidCode(rawPayload) : getArtRegimenOld(rawPayload);
    }

    function getArtRegimenOld(rawPayload) {
        if (rawPayload.artRegimenUuid === "" || rawPayload.artRegimenUuid === null) return 15; //15 is none;

        var arvCodes = rawPayload.artRegimenUuid ? rawPayload.artRegimenUuid.split(" ## ") : null;
        var resolvedId = 16;  // 14 is other

        if (!(arvCodes && arvCodes.length > 0)) return resolvedId;

        _.forEach(eidOrderMap.artRegimen, function (artRegimen) {

            var mrsArvRegimens = artRegimen.mrsArvRegimen.split(",");

            if (hasCode(mrsArvRegimens, arvCodes[0])) {

                var hasCodes = true;

                if (arvCodes.length === 1 && mrsArvRegimens.length != 1) {

                    hasCodes = false;
                } else {

                    for (var i = 1; i < arvCodes.length; i++) {

                        var code = arvCodes[i];
                        if (!hasCode(mrsArvRegimens, arvCodes[i])) {
                            hasCodes = false;
                            break;
                        }
                    }
                }

                if (hasCodes) resolvedId = artRegimen.eidId;
            }
        });

        return resolvedId;
    }

    module.exports = {
        generatePocToEidPayLoad: generatePocToEidPayLoad
    };
})();
