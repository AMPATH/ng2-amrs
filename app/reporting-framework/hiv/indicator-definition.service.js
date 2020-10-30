import * as hivDefinitions from './indicator-definitions.json';
export class IndicatorDefinitionService {
  getDefinitions(indicators) {
    console.log('reporting framework', hivDefinitions);
    return hivDefinitions.indicatorDefinitions.filter(function (el) {
      return indicators.indexOf(el.name) >= 0;
    });
  }
}
