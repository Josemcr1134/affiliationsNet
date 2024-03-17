import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class PaymentsService {
    get header() {
        return {
            headers: {
                'Content-type': `application/x-www-form-urlencoded`,
            },
        };
    }
    public base_url: string = environment.base_url;
    constructor(private http: HttpClient) {}

    Pay(data: any) {
        const url = `${this.base_url}/payment/`;
        return this.http.post(url, data, this.header);
    }

    GetPaymentStatus(id: string) {
        const url = `${this.base_url}/get-payment/${id}/`;
        return this.http.get(url);
    }

    getPaymentDetails(transactionID: string) {
        const url = `${this.base_url}/get-payment/details/${transactionID}`;
        return this.http.get(url);
    }
}
