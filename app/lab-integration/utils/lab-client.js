const rp = require('request-promise');
const eidFacilityMap = require('../../../service/eid/eid-facility-mappings');
// import formurlencoded from 'form-urlencoded';
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
        return this.getPostRequest(payload, `${this.config.serverUrl}/api/eid`,);
    }

    postViralLoad(payload) {
        return this.getPostRequest(payload, `${this.config.serverUrl}/api/vl`);
    }

    postCD4(payload) {
        return this.getPostRequest(payload, `${this.config.serverUrl}/api/cd4`);
    }

    getPostRequest(payload, endpoint) {
        const options = {
            uri: endpoint,
            headers: {
                'apikey': this.config.apiKey,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            // json: true,
            form: payload,
            timeout: 20000
        };
        return rp(options);

    }

    getFetchRequest(filterOptions, offset) {
        // process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
        let fetchOffset = 1;
        let facilityCodes = this.getFacitityCodes().join();
        filterOptions.facility_code = facilityCodes;
        if (offset) {
            fetchOffset = offset;
        }
        // var host = new String(this.config.serverUrl).substr(8);
        var options = {
            uri: `${this.config.serverUrl}/api/function?page=${fetchOffset}`,
            headers: {
                'apikey': this.config.apiKey,
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            json: true,
            insecure: true,
            method: 'POST',
            timeout: 20000,
            form: filterOptions
        };
        // rp(options).then((res)=>{
        //     console.log('RESULTS', res);
        // }).catch((err)=>{
        //     console.error('ERROR', err);
        // });
        return rp(options);
    }

    
    getFacitityCodes() {
        let facilityCodes = [];
        for (let key in eidFacilityMap) {
            let facility = eidFacilityMap[key];
            if (facility.mflCode && facility.mflCode !== '') {
                facilityCodes.push(facility.mflCode);
            }
        }
        return facilityCodes;
    }
}