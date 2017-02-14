

import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { Form } from 'ng2-openmrs-formentry';


export class DraftedFormsService {
    public lastDraftedForm: Form;
    public loadDraftOnNextFormLoad: boolean = false;
    public hasBeenCancelled: boolean =  false;
    private _draftedForm: BehaviorSubject<Form>;
    constructor() { }

    get draftedForm(): Observable<Form> {
        if (this._draftedForm === undefined) {
            this._draftedForm = new BehaviorSubject<Form>(null);
        }
        return this._draftedForm.asObservable();
    }

    setDraftedForm(draftedForm: Form) {
        this.lastDraftedForm = draftedForm;
        this._draftedForm.next(draftedForm);
    }

    setCancelState() {
      this.setDraftedForm(null);
      this.hasBeenCancelled = true;
    }
}
