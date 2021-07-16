import { EncounterType } from "../../../models/encounter-type.model";
import { Pipe, PipeTransform } from "@angular/core";
import * as _ from "lodash";

@Pipe({
  name: "encounterTypeFilter",
  pure: false,
})
export class EncounterTypeFilter implements PipeTransform {
  public transform(encountersArray, encounterFilterTypeArray) {
    if (encounterFilterTypeArray.length === 0) {
      return encountersArray;
    } else {
      const filterd = encountersArray.filter((item) => {
        const result =
          _.includes(encounterFilterTypeArray, item.encounterType.display) ||
          _.includes(encounterFilterTypeArray, item.encounter);

        return result;
      });

      return filterd;
    }
  }
}
