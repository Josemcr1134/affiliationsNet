import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-plan',
    templateUrl: './plan.component.html',
    styleUrls: ['./plan.component.css'],
})
export class PlanComponent implements OnInit {
    @Input() plan!: any;
    constructor() {}

    ngOnInit(): void {}
}
