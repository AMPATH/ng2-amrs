import { VitalView } from "../vital-view";
import { VitalsDatasource } from "../vitals.datasource";

export interface VitalSourceInterface {
  getVitals(ob: any, source?: VitalsDatasource): VitalView | VitalView[];
}
