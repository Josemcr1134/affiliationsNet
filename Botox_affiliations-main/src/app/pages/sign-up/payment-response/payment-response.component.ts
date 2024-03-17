import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaymentsService } from 'src/app/services/payments.service';

@Component({
    selector: 'app-payment-response',
    templateUrl: './payment-response.component.html',
    styleUrls: ['./payment-response.component.css'],
})
export class PaymentResponseComponent implements OnInit {
    transactionID!: string;
    transactionDetails!: any;
    loading: boolean = true;
    constructor(private activatedRoute: ActivatedRoute, private paymentService: PaymentsService) {}

    ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe((params) => {
            this.transactionID = params.id;
            this.getPaymentDetails();
        });
    }

    getPaymentDetails() {
        this.loading = true;
        this.paymentService.getPaymentDetails(this.transactionID).subscribe({
            next: (response) => {
                this.transactionDetails = response;
            },
            complete: () => {
                this.loading = false;
            },
        });
    }

    printDocument() {
        window.print();
    }
}
