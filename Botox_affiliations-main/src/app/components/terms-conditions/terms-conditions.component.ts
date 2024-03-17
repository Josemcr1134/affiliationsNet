import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-terms-conditions',
    templateUrl: './terms-conditions.component.html',
    styleUrls: ['./terms-conditions.component.css'],
})
export class TermsConditionsComponent implements OnInit {
    @Output() responseTermAndConditions: EventEmitter<boolean> = new EventEmitter();
    constructor() {}

    ngOnInit(): void {}

    userResponse(respose: boolean) {
        this.responseTermAndConditions.emit(respose);
    }
}
