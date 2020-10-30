import _ from 'lodash';
const eidOrderMapV2 = require('../../../service/eid/mappings/eid-order-mappings-v2');
const eidOrderMapv1 = require('../../../service/eid/mappings/eid-order-mappings-v1');
const version = require('../../../conf/eid-regimen-config');

const currentConfig = version.eid_regimen_config[0];

const eidOrderMap = currentConfig.version === 1 ? eidOrderMapv1 : eidOrderMapV2;

module.exports = eidOrderMap;
