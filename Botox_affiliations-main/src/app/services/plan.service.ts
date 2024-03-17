import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class PlanService {
    public base_url: string = environment.base_url;
    constructor(private http: HttpClient) {}

    GetPlans(limit: number, offset: number) {
        const url = `${this.base_url}/plan/?limit=${limit}&offset=${offset}`;
        return this.http.get<Plan[]>(url);
    }

    GetPlan(package_id: string) {
        const url = `${this.base_url}/plan/${package_id}/`;
        return this.http.get<Plan>(url);
    }
}

export interface Plan {
    affiliate_fee: number;
    description: string;
    extra_affiliate_fee: number;
    id: string;
    is_active: boolean;
    max_affiliates: number;
    max_extra_affiliates: number;
    name: string;
}
