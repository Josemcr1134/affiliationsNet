import { DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SelectPlanComponent } from './select-plan/select-plan.component';
import localeCO from '@angular/common/locales/es-CO';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeCO);

@NgModule({
    declarations: [AppComponent, SelectPlanComponent],
    imports: [BrowserModule, AppRoutingModule, HttpClientModule],
    providers: [
        { provide: LOCALE_ID, useValue: 'es-CO' },
        { provide: DEFAULT_CURRENCY_CODE, useValue: 'COP' },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
