import { Component, OnInit } from '@angular/core';
import { PlanService } from 'src/app/services/plan.service';

@Component({
    selector: 'app-select-plan',
    templateUrl: './select-plan.component.html',
    styleUrls: ['./select-plan.component.css'],
})
export class SelectPlanComponent implements OnInit {
    plans: any[] = [];
    next: any;
    previous: any;
    offset: number = 0;
    page: number = 1;
    limit: number = 3;

    constructor(private planSvc: PlanService) {}

    ngOnInit(): void {
        this.getPlans();
    }

    getPlans() {
        this.planSvc.GetPlans(this.limit, this.offset).subscribe({
            error: (err: any) => {
                console.log(err);
            },
            next: (resp: any) => {
                this.plans = resp.results;
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
        } else if (this.plans.length === 0) {
            this.offset = this.limit * (this.page - 1) - this.limit;
        }
        this.getPlans();
    }
}
