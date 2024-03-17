import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SelectPlanComponent } from './select-plan/select-plan.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { PaymentDetailComponent } from './sign-up/payment-detail/payment-detail.component';
import { PaymentResponseComponent } from './sign-up/payment-response/payment-response.component';

const routes: Routes = [
    {
        path: 'select-plan',
        component: SelectPlanComponent,
    },
    {
        path: 'signup/:planID',
        component: SignUpComponent,
    },
    {
        path: 'payment-details/:mainAffiliate',
        component: PaymentDetailComponent,
    },
    {
        path: 'payment-response',
        component: PaymentResponseComponent,
    },
    {
        path: '',
        redirectTo: 'select-plan',
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PagesRoutingModule {}
