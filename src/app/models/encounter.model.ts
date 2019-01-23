import {BaseModel} from './base-model.model';
import {Patient} from './patient.model';
import {EncounterType} from './encounter-type.model';
import {Form} from './form.model';
import {Location} from './location.model';
import {Provider} from './provider.model';
import {Visit} from './visit.model';
import {serializable} from './serializable.decorator';
import './date.extensions';

export class Encounter extends BaseModel {
    private _encounterDatetime: Date;
    private _patient: Patient;
    private _encounterType: EncounterType;
    private _location: Location;
    private _form: Form;
    private _provider: Provider;
    private _visit: Visit;

    constructor(openmrsModel?: any) {
        super(openmrsModel);
    }

    @serializable()
    public get encounterDatetime(): Date {
        if (this._encounterDatetime === null || this._encounterDatetime === undefined) {
            this._encounterDatetime = new Date(this._openmrsModel.encounterDatetime);
        }
        return this._encounterDatetime;
    }
    public set encounterDatetime(v: Date) {
        this._openmrsModel.encounterDatetime = v.toServerTimezoneString();
        this._encounterDatetime = v;
    }

    @serializable()
    public get patient(): Patient {
        if (this._patient === null || this._patient === undefined) {
            this.initializeNavigationProperty('patient');
            this._patient = new Patient(this._openmrsModel.patient);
        }
        return this._patient;
    }
    public set patient(v: Patient) {
        this._openmrsModel.patient = v.openmrsModel;
        this._patient = v;
    }

    @serializable()
    public get encounterType(): EncounterType {
        if (this._encounterType === null || this._encounterType === undefined) {
            this.initializeNavigationProperty('encounterType');
            this._encounterType = new EncounterType(this._openmrsModel.encounterType);
        }
        return this._encounterType;
    }
    public set encounterType(v: EncounterType) {
        this._openmrsModel.encounterType = v.openmrsModel;
        this._encounterType = v;
    }

    @serializable()
    public get location(): Location {
        if (this._location === null || this._location === undefined) {
            this.initializeNavigationProperty('location');
            this._location = new Location(this._openmrsModel.location);
        }
        return this._location;
    }
    public set location(v: Location) {
        this._openmrsModel.location = v.openmrsModel;
        this._location = v;
    }

    @serializable()
    public get form(): Form {
        if (this._form === null || this._form === undefined) {
            this.initializeNavigationProperty('form');
            this._form = new Form(this._openmrsModel.form);
        }
        return this._form;
    }
    public set form(v: Form) {
        this._openmrsModel.form = v.openmrsModel;
        this._form = v;
    }

    @serializable()
    public get provider(): Provider {
        if (this._provider === null || this._provider === undefined) {
            this.initializeNavigationProperty('provider');
            // Easiest fix for now
            if (this._openmrsModel.encounterProviders &&
                this._openmrsModel.encounterProviders.length > 0) {
                this._provider = new Provider(this._openmrsModel.encounterProviders[0].provider);
            } else {
                this._provider = new Provider(this._openmrsModel.provider);
            }
        }
        return this._provider;
    }
    public set provider(v: Provider) {
        this._openmrsModel.provider = v.openmrsModel;
        this._provider = v;
    }

    @serializable()
    public get visit(): Visit {
        if (this._visit === null || this._visit === undefined) {
            this.initializeNavigationProperty('visit');
            this._visit = new Visit(this._openmrsModel.visit);
        }
        return this._visit;
    }
    public set visit(v: Visit) {
        this._openmrsModel.visit = v.openmrsModel;
        this._visit = v;
    }

    // TODO: Add Obs and Orders Array
}
