import { Component, OnInit, OnDestroy } from '@angular/core';
import { FeedBackService } from './feedback.service';
import { UserService } from '../openmrs-api/user.service';
import { UserDefaultPropertiesService }
    from '../user-default-properties/user-default-properties.service';
import { Subscription } from 'rxjs';
@Component({
    selector: 'feedback',
    templateUrl: 'feedback.component.html',
    styleUrls: ['feedback.component.css'],
    providers: [FeedBackService, UserService, UserDefaultPropertiesService]
})
export class FeedBackComponent implements OnInit, OnDestroy {
    payload = {
        name: '',
        phone: '',
        message: '',
        location: ''
    };
    success = false;
    error = false;
    busy: Subscription;
    errorMessage: string = '';
    hasError: boolean = false;
    r1 = /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,3})|(\(?\d{2,3}\)?))/;
    r2 = /(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/;
    patterns = new RegExp(this.r1.source + this.r2.source);
    constructor(private feedBackService: FeedBackService,
        private userService: UserService,
        private userDefaultPropertiesService: UserDefaultPropertiesService) { }

    ngOnInit() {
    }

    ngOnDestroy() {
        if (this.busy) {
            this.busy.unsubscribe();
        }
    }

    public sendFeedBack() {
        this.validatePhoneNumberField(this.payload.phone);
        this.payload.name = this.userService.getLoggedInUser().person.display;
        let location = this.userDefaultPropertiesService.getCurrentUserDefaultLocationObject()
            || {};
        this.payload.location = location.display || 'Default location not set';
        this.busy = this.feedBackService.postFeedback(this.payload).subscribe((res) => {
            this.success = true;
            console.log('this.payload', this.payload.phone);
            this.payload = {
                name: '',
                phone: '',
                message: '',
                location: ''
            };
        }, (error) => {
            console.log('Error');
            this.error = true;
        });
    }

    public goBack() {
        window.history.back();
    }

    public dismissSuccess() {
        this.success = false;
    }

    public dismissError() {
        this.error = false;
    }

    private setErroMessage(message) {

        this.hasError = true;
        this.errorMessage = message;
    }

    private validatePhoneNumberField(phone) {

        if (this.isNullOrUndefined(phone)) {
            this.setErroMessage('Phone number is required.');
            return false;
        }


        return true;
    }

    private isNullOrUndefined(val) {
        return val === null || val === undefined || val === ''
            || val === 'null' || val === 'undefined';
    }
}
