import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AffiliationsService, AffiliateForm, PaymentInfo } from 'src/app/services/affiliations.service';
import { Plan, PlanService } from 'src/app/services/plan.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit, OnDestroy {
    planID!: string;
    planSelected!: Plan;
    amountExtraAffiliate: number = 0;
    totalToPay: number = 0;
    isOpenMainAffiliateForm: boolean = true;
    showBeneficiaryModal: boolean = false;
    mainAffiliate: AffiliateForm | null = null;
    beneficiaryDataList: AffiliateForm[] = [];
    beneficiaryToEdit: AffiliateForm | null = null;
    mainAffiliateSubscription!: Subscription;
    beneficiaryListSubscription!: Subscription;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private planService: PlanService,
        private affiliationsSvc: AffiliationsService
    ) {}

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((resp: any) => {
            this.planID = resp.planID;
            this.getPlanDetails();
            this.affiliationsSvc.updatePlanID(this.planID);
        });

        this.mainAffiliateSubscription = this.affiliationsSvc.getCurrentMainAffiliate().subscribe((mainAffiliate) => {
            this.mainAffiliate = mainAffiliate;
        });

        this.beneficiaryListSubscription = this.affiliationsSvc.getBeneficiaryList().subscribe((beneficiaries) => {
            this.beneficiaryDataList = beneficiaries;
        });
    }

    ngOnDestroy(): void {
        if (this.mainAffiliateSubscription) {
            this.mainAffiliateSubscription.unsubscribe();
        }
        if (this.beneficiaryListSubscription) {
            this.beneficiaryListSubscription.unsubscribe();
        }
    }

    getPlanDetails() {
        this.planService.GetPlan(this.planID).subscribe({
            error: (err: any) => {},
            next: (plan: Plan) => {
                this.planSelected = plan;
                this.totalToPay = plan.affiliate_fee;
            },
        });
    }

    editBeneficiary(beneficiarySelected: AffiliateForm) {
        this.showBeneficiaryModal = true;
        this.beneficiaryToEdit = beneficiarySelected;
    }

    deleteBeneficiary(beneficiarySelected: AffiliateForm) {
        Swal.fire({
            title: 'Eliminar Beneficiario',
            text: `Desea eliminar el beneficiario ${beneficiarySelected.first_name} ${beneficiarySelected.last_name}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#542583',
            cancelButtonColor: '#12b5cc',
            confirmButtonText: 'Si',
            cancelButtonText: 'No',
        }).then((result) => {
            if (result.isConfirmed) {
                this.affiliationsSvc.removeBeneficiary(beneficiarySelected);
            }
        });
    }

    saveData() {
        if (this.beneficiaryDataList.length === this.planSelected.max_affiliates && this.mainAffiliate) {
            const signUpData = {
                main_affiliates: this.mainAffiliate,
                beneficiaries: this.beneficiaryDataList,
            };
            this.affiliationsSvc.signUp(signUpData).subscribe({
                error: (error: any) => {
                    const message: string = error.message ? error.message : 'Error al intentar guardar la información.';
                    Swal.fire('Oooops', message, 'error');
                },
                next: (response: PaymentInfo) => {
                    this.affiliationsSvc.setPaymentData(response);
                    localStorage.removeItem('processStartedOn');
                    this.router.navigate(['payment-details/' + response.user_id]);
                },
            });
        } else {
            Swal.fire('Oooops', 'Debe registrar todos los afiliados para continuar.', 'warning');
        }
    }

    onIsOpenMainAffiliateForm(response: boolean) {
        this.isOpenMainAffiliateForm = response;
    }

    onCloseBeneficiaryModal(response: boolean) {
        this.showBeneficiaryModal = !response;
        this.beneficiaryToEdit = null;
    }
}
