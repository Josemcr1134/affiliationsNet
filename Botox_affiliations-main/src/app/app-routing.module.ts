import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SelectPlanComponent } from './select-plan/select-plan.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';

const routes: Routes = [
    //   {
    //     path:'SelectPlan',
    //     component:SelectPlanComponent
    //   },
    //   {
    //     path:'Register',
    //     loadChildren:() => import('./components/components.module').then(m => m.ComponentsModule)
    //   },
    // {
    //     path: '',
    //     redirectTo: 'SelectPlan',
    //     pathMatch: 'full',
    // },
    {
        path: '',
        loadChildren: () => import('./pages/pages.module').then((m) => m.PagesModule),
    },
    {
        path: 'not-found',
        component: NotFoundPageComponent,
    },
    {
        path: '**',
        redirectTo: '/not-found',
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
