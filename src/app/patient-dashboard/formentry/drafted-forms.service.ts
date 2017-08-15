import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { Form } from 'ng2-openmrs-formentry';
import { ActivatedRouteSnapshot } from '@angular/router';

export class DraftedFormsService {
    public lastDraftedForm: Form;
    public loadDraftOnNextFormLoad: boolean = false;
    public hasBeenCancelled: boolean = false;
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
