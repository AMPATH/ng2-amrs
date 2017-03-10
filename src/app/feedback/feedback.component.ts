import { Component, OnInit, OnDestroy } from '@angular/core';
import { FeedBackService } from './feedback.service';
import { UserService } from '../openmrs-api/user.service';
import { Subscription } from 'rxjs';
@Component({
    selector: 'feedback',
    templateUrl: 'feedback.component.html',
    styleUrls: ['feedback.component.css'],
    providers: [FeedBackService]
})
export class FeedBackComponent implements OnInit, OnDestroy {
    payload = {
        name: '',
        phone: '',
        message: ''
    };
    success = false;
    error = false;
    busy: Subscription;
    constructor(private feedBackService: FeedBackService, private userService: UserService) { }

    ngOnInit() { }

    ngOnDestroy() {
        if (this.busy) {
            this.busy.unsubscribe();
        }
    }

    public sendFeedBack() {
        this.payload.name = this.userService.getLoggedInUser().person.display;
        this.busy = this.feedBackService.postFeedback(this.payload).subscribe((res) => {
            this.success = true;
            this.payload = {
                name: '',
                phone: '',
                message: ''
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
}
