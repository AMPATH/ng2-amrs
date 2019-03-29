const rp = require('request-promise');
const eidFacilityMap = require('../../../service/eid/eid-facility-mappings');
export class LabClient {
    config = null;
    constructor(config) {
        if (!config.serverUrl && !config.apiKey) {
            throw (Error('Please check if the server url and apikey is set'));
        }
        this.config = config;
    }
    /* This functions have swallow promise errors because the specific user case where we want all promises resolve when executed with Promise.All
        procced with caution
    */
    fetchDNAPCR(filterOptions, offset) {
        if (!filterOptions) {
            throw (Error('Please supply filter options'));
        }
        filterOptions.test = 1;
        filterOptions.dispatched = 1;
        return this.getFetchRequest(filterOptions, offset).catch(function (err) {
            //return error;
            return err;
        });
    }

    fetchViralLoad(filterOptions, offset) {
        if (!filterOptions) {
            throw (Error('Please supply filter options'));
        }
        filterOptions.test = 2;
        filterOptions.dispatched = 1;
        return this.getFetchRequest(filterOptions, offset).catch(function (err) {
            //return error;
            return err;
        });
    }

    fetchPendingViralLoad(filterOptions, offset) {
        if (!filterOptions) {
            throw (Error('Please supply filter options'));
        }
        filterOptions.test = 2;
        filterOptions.dispatched = 0;
        return this.getFetchRequest(filterOptions, offset).catch(function (err) {
            //return error;
            return err;
        });
    }


    fetchCD4(filterOptions, offset) {
        if (!filterOptions) {
            throw (Error('Please supply filter options'));
        }
        filterOptions.test = 3;
        filterOptions.dispatched = 1;
        return this.getFetchRequest(filterOptions, offset).catch(function (err) {
            //return error;
            return err;
        });
    }

    postLabPayload(payload) {
        switch (payload.test) {
            case 1:
                return this.postDNAPCR(payload);
            case 2:
                return this.postViralLoad(payload);
            case 3:
                return this.postCD4(payload);
            default:
                break;
        }

    }
    postDNAPCR(payload) {
        var options = {
            uri: `${this.config.serverUrl}/api/eid`,
            headers: {
                'apikey': this.config.apiKey
            },
            method: 'POST',
            formData: payload
        };
        return rp(options);
    }

    postViralLoad(payload) {
        var options = {
            uri: `${this.config.serverUrl}/api/vl`,
            headers: {
                'apikey': this.config.apiKey
            },
            method: 'POST',
            formData: payload
        };
        return rp(options);
    }

    postCD4(payload) {
        var options = {
            uri: `${this.config.serverUrl}/api/cd4`,
            headers: {
                'apikey': this.config.apiKey
            },
            method: 'POST',
            formData: payload
        };
        return rp(options);
    }

    getFetchRequest(filterOptions, offset) {
        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
        let fetchOffset = 1;
        let facilityCodes = this.getFacitityCodes().join();
        filterOptions.facility_code = facilityCodes;
        if (offset) {
            fetchOffset = offset;
        }
        var options = {
            uri: `${this.config.serverUrl}/api/function?page=${fetchOffset}`,
            headers: {
                'apikey': this.config.apiKey
            },
            json: true,
            insecure: true,
            method: 'POST',
            formData: filterOptions
        };
        return rp(options);
    }
    getFacitityCodes() {
        let facilityCodes = [];
        for (let key in eidFacilityMap) {
            let facility = eidFacilityMap[key];
            if(facility.mflCode && facility.mflCode !== ''){
                facilityCodes.push(facility.mflCode);
            }
        }
        return facilityCodes;
    }
}