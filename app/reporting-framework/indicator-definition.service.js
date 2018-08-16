import * as hivDefinitions from './hiv/indicator-definitions.json'
export class IndicatorDefinitionService {
    getDefinitions(indicators){
        return hivDefinitions.indicatorDefinitions.filter(function (el) {
            return indicators.indexOf(el.name) >= 0;
          });

    }
}