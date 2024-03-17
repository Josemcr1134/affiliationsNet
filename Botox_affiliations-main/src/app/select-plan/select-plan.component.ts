import { Component, OnInit } from '@angular/core';
import { LocationService } from '../services/location.service';
import { PlanService } from '../services/plan.service';

@Component({
    selector: 'app-select-plan',
    templateUrl: './select-plan.component.html',
    styleUrls: ['./select-plan.component.css'],
})
export class SelectPlanComponent implements OnInit {
    public Plans: any[] = [];
    public next: any;
    public previous: any;
    public offset: number = 0;
    public page: number = 1;
    public limit: number = 3;
    constructor(private planSvc: PlanService) {}

    ngOnInit(): void {
        this.GetPlans();
        localStorage.clear();
    }

    GetPlans() {
        this.planSvc.GetPlans(this.limit, this.offset).subscribe({
            error: (err: any) => {
                console.log(err);
            },
            next: (resp: any) => {
                this.Plans = resp.results;
                this.next = resp.next;
                this.previous = resp.previous;
            },
        });
    }

    Pagination(value: number) {
        this.page += value;

        if (this.page > 0) {
            this.offset = this.limit * this.page - this.limit;
        } else if (this.page < 1) {
            this.page === 1;
        } else if (this.Plans.length === 0) {
            this.offset = this.limit * (this.page - 1) - this.limit;
        }
        this.GetPlans();
    }
}
