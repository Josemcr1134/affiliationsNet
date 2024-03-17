import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-privacy-policies',
    templateUrl: './privacy-policies.component.html',
    styleUrls: ['./privacy-policies.component.css'],
})
export class PrivacyPoliciesComponent implements OnInit {
    @Output() responsePrivacyPolicies: EventEmitter<boolean> = new EventEmitter();
    constructor() {}

    ngOnInit(): void {}

    userResponse(respose: boolean) {
        this.responsePrivacyPolicies.emit(respose);
    }
}
