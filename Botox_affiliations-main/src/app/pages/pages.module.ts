import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { SelectPlanComponent } from './select-plan/select-plan.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { PlanComponent } from './select-plan/plan/plan.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { AffiliateFormComponent } from './sign-up/affiliate-form/affiliate-form.component';
import { BeneficiaryFormComponent } from './sign-up/beneficiary-form/beneficiary-form.component';
import { PrivacyPoliciesComponent } from './sign-up/privacy-policies/privacy-policies.component';
import { TermsConditionsComponent } from './sign-up/terms-conditions/terms-conditions.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PaymentDetailComponent } from './sign-up/payment-detail/payment-detail.component';
import { PaymentResponseComponent } from './sign-up/payment-response/payment-response.component';

@NgModule({
    declarations: [
        SelectPlanComponent,
        NotFoundPageComponent,
        PlanComponent,
        SignUpComponent,
        AffiliateFormComponent,
        BeneficiaryFormComponent,
        PrivacyPoliciesComponent,
        TermsConditionsComponent,
        PaymentDetailComponent,
        PaymentResponseComponent,
    ],
    imports: [CommonModule, PagesRoutingModule, ReactiveFormsModule],
})
export class PagesModule {}
