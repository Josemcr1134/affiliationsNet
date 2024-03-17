import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PaymentComponent } from './payment/payment.component';
import { RegisterComponent } from './register/register.component';
import { ComponentsComponent } from './components.component';
import { SelectPlanComponent } from '../select-plan/select-plan.component';


const routes: Routes = [
   
    {
        path:'Plan/:id', 
        component:ComponentsComponent,
        children:[
            { path: '', component: RegisterComponent },
            { path: 'Payment', component: PaymentComponent },
            { path: '**', redirectTo:"", pathMatch:'full' },
        ]
    },
    {
        path:"**", 
        redirectTo:'SelectPlan'
    }
   
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CompontentsRoutingModule {}
