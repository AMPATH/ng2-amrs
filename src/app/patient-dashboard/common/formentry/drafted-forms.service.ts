import { Observable, BehaviorSubject } from 'rxjs';
import { Form } from 'ngx-openmrs-formentry/';
import { ActivatedRouteSnapshot } from '@angular/router';

export class DraftedFormsService {
    public lastDraftedForm: Form;
    public loadDraftOnNextFormLoad = false;
    public hasBeenCancelled = false;
    public routeSnapshot: ActivatedRouteSnapshot;
    private _draftedForm: BehaviorSubject<Form>;
    constructor() { }

    get draftedForm(): Observable<Form> {
        if (this._draftedForm === undefined) {
            this._draftedForm = new BehaviorSubject<Form>(null);
        }
        return this._draftedForm.asObservable();
    }

    public setDraftedForm(draftedForm: Form) {
        this.lastDraftedForm = draftedForm;
        this._draftedForm.next(draftedForm);
        if (!draftedForm) {
            this.routeSnapshot = null;
        }
    }

    public saveRouteSnapshot(routeSnapshot: ActivatedRouteSnapshot) {
        this.routeSnapshot = routeSnapshot;
    }

    public getRouteSnapshot() {
        return this.routeSnapshot;
    }

    public setCancelState() {
        this.setDraftedForm(null);
        this.hasBeenCancelled = true;
    }
}
