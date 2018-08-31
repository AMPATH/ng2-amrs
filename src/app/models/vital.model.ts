import { BaseModel } from './base-model.model';
import * as _ from 'lodash';
export class Vital extends BaseModel {

    constructor(openmrsModel?: any) {
        super(openmrsModel);
    }

    public get systolic(): number {
        return this._openmrsModel.systolic;
    }
    public set systolic(v: number) {
        this._openmrsModel.systolic = v;
    }
    public get diastolic(): number {
        return this._openmrsModel.diastolic;
    }

    public set diastolic(v: number) {
        this._openmrsModel.diastolic = v;
    }

    public get pulse(): number {
        return this._openmrsModel.pulse;
    }

    public set pulse(v: number) {
        this._openmrsModel.pulse = v;
    }

    public get temperature(): number {
        return this._openmrsModel.temperature;
    }

    public set temperature(v: number) {
        this._openmrsModel.temperature = v;
    }

    public get oxygenSaturation(): number {
        return this._openmrsModel.oxygenSaturation;
    }

    public set oxygenSaturation(v: number) {
        this._openmrsModel.oxygenSaturation = v;
    }

    public get height(): number {
        return this._openmrsModel.height;
    }

    public set height(v: number) {
        this._openmrsModel.height = v;
    }

    public get weight(): number {
        return this._openmrsModel.weight;
    }

    public set weight(v: number) {
        this._openmrsModel.weight = v;
    }

    public get bmi(): number {
        return this._openmrsModel.bmi;
    }

    public set bmi(v: number) {
        this._openmrsModel.bmi = v;
    }
    public get bsa(): number {
        return this._openmrsModel.bsa;
    }
    public set bsa(v: number) {
        this._openmrsModel.bsa = v;
    }
}
