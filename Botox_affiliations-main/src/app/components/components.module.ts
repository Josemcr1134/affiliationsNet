import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentComponent } from './payment/payment.component';
import { RegisterComponent } from './register/register.component';
import { CompontentsRoutingModule } from './component.routes';
import { ComponentsComponent } from './components.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';
import { PrivacyPoliciesComponent } from './privacy-policies/privacy-policies.component';

@NgModule({
    declarations: [PaymentComponent, RegisterComponent, ComponentsComponent, TermsConditionsComponent, PrivacyPoliciesComponent],
    imports: [CommonModule, CompontentsRoutingModule, SharedModule, FormsModule],
})
export class ComponentsModule {}
