import { Component, OnInit } from '@angular/core';
import { PlanService } from '../../services/plan.service';
import { Router } from '@angular/router';
import { WompiService } from '../../services/wompi.service';
import { PaymentsService } from 'src/app/services/payments.service';
import Swal from 'sweetalert2';
import { Token } from '@angular/compiler';
import { HttpParams } from '@angular/common/http';

@Component({
    selector: 'app-payment',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.css'],
})
export class PaymentComponent implements OnInit {
    public test_email = /^\w+([\.\+\-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
    public email: string = '';
    public pay_method: number = 0;
    public card_type: number = 0;
    public id: string = '';
    public plan_name: string = '';
    public plan_affiliate_fee: number = 0;
    public plan_extra_affiliate_fee: number = 0;
    public people: number = 0;
    public extra_people: number = 0;
    public extra_people_show: number = 0;
    public regular_people: number = 0;
    public regular_people_show: number = 0;
    public total_to_pay: number = 0;
    public total_to_pay_show: number = 0;
    public nequi: string = '';
    public installments: number = 1;
    public data_to_pay: {} = {};
    public card_number: string = '';
    public exp_month: string = '';
    public exp_year: string = '';
    public cvc: string = '';
    public card_holder: string = '';
    public pay_completed: boolean = false;
    public payment_status: string = '';
    public payment_id: string = '';
    public terms: any;
    public accept_terms: boolean = false;
    public paid: any;
    public people_plan: number = 0;
    constructor(private planSvc: PlanService, private router: Router, private wompiSvc: WompiService, private paymentSvc: PaymentsService) {}

    ngOnInit(): void {
        this.paid = localStorage.getItem('paid');
        if (this.paid === 'ok') {
            window.location.href = 'https://affiliates.netcare.life/auth/login';
        }
        const parentID = localStorage.getItem('parent_id');
        this.id = localStorage.getItem('plan') || '';
        this.regular_people = Number(localStorage.getItem('Regular_People'));
        this.extra_people = Number(localStorage.getItem('Extra_people'));
        this.regular_people_show = Number(localStorage.getItem('Regular_People'));
        this.extra_people_show = Number(localStorage.getItem('Extra_people'));
        if (parentID === null) {
            this.router.navigate(['/Register/Plan', this.id]);
        }
        this.GetPlanById();
        this.GetTermsAndConditions();
    }

    ChoosePayMethod(value: number) {
        this.pay_method = value;
        this.card_type = 0;
    }

    ChooseCardType(value: number) {
        this.card_type = value;
    }

    GetPlanById() {
        this.planSvc.GetPlan(this.id).subscribe({
            error: (err: any) => {
                console.log(err);
            },
            next: (resp: any) => {
                this.plan_name = resp.name;
                this.plan_affiliate_fee = resp.affiliate_fee;
                this.plan_extra_affiliate_fee = resp.extra_affiliate_fee;
                this.people_plan = resp.max_affiliates;
                this.total_to_pay = resp.max_affiliates * this.plan_affiliate_fee || 0;
                this.total_to_pay = this.total_to_pay + this.extra_people * this.plan_extra_affiliate_fee || 0;
                this.total_to_pay_show = resp.max_affiliates * this.plan_affiliate_fee || 0;
                this.total_to_pay_show = this.total_to_pay_show + this.extra_people * this.plan_extra_affiliate_fee || 0;
            },
        });
    }

    AddNequiToWompi() {
        this.pay_completed = !this.pay_completed;

        const body = {
            phone_number: this.nequi,
        };

        this.wompiSvc.SendNequiToTokenize(body).subscribe({
            error: (err: any) => {
                this.pay_completed = !this.pay_completed;
                Swal.fire('Oooops', 'Tu cuenta de nequi fue declinada', 'error');
            },
            next: (resp: any) => {
                this.Pay(resp.data.id);
            },
        });
    }

    AddCardToWompi() {
        this.pay_completed = !this.pay_completed;
        const body = {
            number: this.card_number.toString(), // Número de tarjeta (como un string, sin espacios)
            exp_month: this.exp_month.toString(), // Mes de expiración (como string de 2 dígitos)
            exp_year: this.exp_year.toString(), // Año de expiración (como string de 2 dígitos)
            cvc: this.cvc, // Código de seguridad (como string de 3 o 4 dígitos)
            card_holder: this.card_holder, // Nombre del tarjeta habiente (string de mínimo 5 caracteres)
        };
        this.wompiSvc.SendCardToTokenize(body).subscribe({
            error: (err: any) => {
                console.log(err, body);
                Swal.fire('Oooops', 'Tu tarjeta fue declinada', 'error');
            },
            next: (resp: any) => {
                if (resp.status === 'CREATED') {
                    this.Pay(resp.data.id);
                } else {
                    Swal.fire('Oooops', 'Tu tarjeta fue declinada', 'error');
                }
            },
        });
    }

    Pay(token: string) {
        let bodyNequi = new URLSearchParams();
        bodyNequi.set('payment_type', 'NEQUI');
        bodyNequi.set('payment_token', token);
        bodyNequi.set('customer_email', localStorage.getItem('parent_email') || '');
        bodyNequi.set('amount_in_cents', (this.total_to_pay * 100).toString());

        let bodyCard = new URLSearchParams();
        bodyCard.set('payment_type', 'CARD');
        bodyCard.set('payment_token', token);
        bodyCard.set('customer_email', localStorage.getItem('parent_email') || '');
        bodyCard.set('amount_in_cents', (this.total_to_pay * 100).toString());
        bodyCard.set('installments', this.installments.toString());

        if (this.pay_method === 1) {
            this.data_to_pay = bodyNequi;
        } else if (this.pay_method === 2) {
            this.data_to_pay = bodyCard;
        }

        this.paymentSvc.Pay(this.data_to_pay).subscribe({
            error: (err: any) => {
                Swal.fire('Ooooops', 'No pudimos completar tu pago, revisa los datos y vuelve a intentarlo', 'error');
                this.pay_completed = !this.pay_completed;
            },
            next: (resp: any) => {
                // Swal.fire('Éxito', resp.Message, 'success');
                this.GetPaymentStatus(resp.transaction_id);
            },
        });
    }

    GetPaymentStatus(id: string) {
        setTimeout(() => {
            this.paymentSvc.GetPaymentStatus(id).subscribe({
                error: (err: any) => {
                    this.pay_method = 3;
                    this.pay_completed = !this.pay_completed;
                },
                next: (resp: any) => {
                    this.payment_status = resp.status;
                    this.pay_method = 3;
                    if (resp.status === 'APPROVED') {
                        localStorage.setItem('paid', 'ok');
                    }
                    this.payment_id = id;
                    this.pay_completed = !this.pay_completed;
                },
            });
        }, 5000);
    }

    GetTermsAndConditions() {
        this.wompiSvc.GetTermsAndConditions().subscribe({
            error: (err: any) => {
                console.log(err);
            },
            next: (resp: any) => {
                this.terms = resp.data.presigned_acceptance.permalink;
            },
        });
    }
}
