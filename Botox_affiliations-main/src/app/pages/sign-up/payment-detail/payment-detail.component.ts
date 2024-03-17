import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AffiliationsService, PaymentInfo } from 'src/app/services/affiliations.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-payment-detail',
    templateUrl: './payment-detail.component.html',
    styleUrls: ['./payment-detail.component.css'],
})
export class PaymentDetailComponent implements OnInit, OnDestroy {
    constructor(private activatedRoute: ActivatedRoute, private affiliateService: AffiliationsService) {}

    currentUserID!: string;
    paymentInfo: PaymentInfo = {} as PaymentInfo;
    paymentInfoSubscription!: Subscription;
    publicKey: string = environment.pub_wompi_test;
    redirectUrl: string = environment.wompi_redirec_url;

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((resp: any) => {
            this.currentUserID = resp.mainAffiliate;
        });
        this.paymentInfoSubscription = this.affiliateService.paymentData.subscribe((paymentInfo) => {
            this.paymentInfo = paymentInfo;
        });
    }

    ngOnDestroy(): void {
        if (this.paymentInfoSubscription) {
            this.paymentInfoSubscription.unsubscribe();
        }
    }
}
