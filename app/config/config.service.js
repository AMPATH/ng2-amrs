const config = require('../../conf/config');
const ConfigService = {
  getConfig: () => {
    return config;
  }
};
Object.freeze(ConfigService);
export default ConfigService;
