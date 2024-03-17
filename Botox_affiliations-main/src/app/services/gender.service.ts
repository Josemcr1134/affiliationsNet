import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class GenderService {
    public base_url: string = environment.base_url;
    constructor(private http: HttpClient) {}

    GetMaritalStatus() {
        const url = `${this.base_url}/marital-status/`;
        return this.http.get<ListResponse>(url);
    }

    GetGenders() {
        const url = `${this.base_url}/gender/`;
        return this.http.get(url);
    }
}

export interface ListResponse {
    count: number;
    next: number | null;
    previous: number | null;
    results: any[];
}
