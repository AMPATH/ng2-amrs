var indicatorsDefs = require('../reporting-framework/hiv/case-management-indicators.json');

var defs = {
  getIndicatorDefinitions: getIndicatorDefinitions
};

function getIndicatorDefinitions(){

  return new Promise((resolve , reject) => {
       resolve (indicatorsDefs)
  });
}

module.exports  = defs;