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
        // let facilityCodes = this.getFacitityCodes().join();
        // filterOptions.facility_code = facilityCodes;
        let facilityCodes = this.getFacitityCodesDictionary();

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
        return new Promise((resolve, reject) => {
            rp(options).then((response)=>{
                var unknownMFL = [];
                if(Array.isArray(response.data) && response.data.length > 0) {
                    response.data = response.data.filter((item) => {
                        if(facilityCodes[item.facility_code]) {
                            return true;
                        } else {
                            unknownMFL.push(item.facility_code);
                        }
                        return false;
                    });
                }
                if(unknownMFL.length > 0) {
                    // post unknown MFL code to slack
                    console.warn('Unknown MFL codes', unknownMFL);
                }
                // console.log('RESULTS', response);
                resolve(response);
            }).catch((err)=>{
                console.error('LAB INTEGRATION ERROR:', err);
                reject(err);
            });
        });
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

    getFacitityCodesDictionary() {
        let facilityCodes = {};
        for (let key in eidFacilityMap) {
            let facility = eidFacilityMap[key];
            if (facility.mflCode && facility.mflCode !== '') {
                facilityCodes[facility.mflCode] = facility.mflCode;
            }
        }
        return facilityCodes;
    }
}