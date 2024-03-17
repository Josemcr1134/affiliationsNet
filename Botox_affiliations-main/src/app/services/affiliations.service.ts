import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AffiliationsService {
    private _mainAffiliate: BehaviorSubject<AffiliateForm> = new BehaviorSubject({} as AffiliateForm);
    private currentMainAffiliate: Observable<AffiliateForm> = this._mainAffiliate.asObservable();
    private _beneficiaryList: BehaviorSubject<AffiliateForm[]> = new BehaviorSubject([] as AffiliateForm[]);
    private beneficiaryList: Observable<AffiliateForm[]> = this._beneficiaryList.asObservable();
    private _paymentDataSource: BehaviorSubject<PaymentInfo> = new BehaviorSubject({} as PaymentInfo);
    paymentData = this._paymentDataSource.asObservable();

    public base_url: string = environment.base_url;
    constructor(private http: HttpClient) {}

    getCurrentMainAffiliate(): Observable<AffiliateForm> {
        return this.currentMainAffiliate;
    }

    setMainAffiliate(affiliate: AffiliateForm) {
        this._mainAffiliate.next(affiliate);
    }

    getBeneficiaryList(): Observable<AffiliateForm[]> {
        return this.beneficiaryList;
    }

    setPaymentData(data: PaymentInfo) {
        this._paymentDataSource.next(data);
    }

    addBeneficiary(beneficiary: AffiliateForm) {
        const currentBeneficiaryList = [...this._beneficiaryList.value];
        this._beneficiaryList.next([...currentBeneficiaryList, beneficiary]);
    }

    updateBeneficiary(oldData: AffiliateForm, newData: AffiliateForm) {
        const currentBeneficiaryList = [...this._beneficiaryList.value];
        const beneficiaryIndex = currentBeneficiaryList.findIndex((obj) => JSON.stringify(obj) === JSON.stringify(oldData));
        if (beneficiaryIndex != -1) {
            currentBeneficiaryList[beneficiaryIndex] = newData;
        }
        this._beneficiaryList.next([...currentBeneficiaryList]);
    }

    removeBeneficiary(beneficiary: AffiliateForm) {
        const newBeneficiaryList = this._beneficiaryList.value.filter((obj) => JSON.stringify(obj) !== JSON.stringify(beneficiary));
        this._beneficiaryList.next([...newBeneficiaryList]);
    }

    removeAllData() {
        this._mainAffiliate.next({} as AffiliateForm);
        this._beneficiaryList.next([]);
        this._paymentDataSource.next({} as PaymentInfo);
    }

    updatePlanID(planID: string) {
        if (this._mainAffiliate.value.document_number) {
            this._mainAffiliate.value.plan = planID;
            const currentBeneficiaryList = [...this._beneficiaryList.value];
            currentBeneficiaryList.map((obj) => {
                obj.plan = planID;
            });
        }
    }

    Affiliate(data: {}) {
        const url = `${this.base_url}/affiliate/`;
        return this.http.post(url, data);
    }

    GetParentID(email: string) {
        const url = `${this.base_url}/affiliate/get_user_id/?email=${email}`;
        return this.http.get(url);
    }

    signUp(body: any) {
        const url = `${this.base_url}/register/affiliates/`;
        return this.http.post<PaymentInfo>(url, body);
    }
}

export interface AffiliateForm {
    document_type: string;
    document_number: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    gender: string;
    password1: string;
    password2: string;
    marital_status: string;
    birthdate: string;
    privacy_policy: boolean;
    terms_and_conditions: boolean;
    relationship: string;
    address: string;
    address_detail: string;
    country: string;
    department: string;
    municipality: string;
    neighborhood: string;
    plan: string;
}

export interface PaymentInfo {
    user_id: string;
    full_name: string;
    email: string;
    phone_number: string;
    legal_id: string;
    legal_id_type: string;
    plan_name: string;
    plan_value: number;
    provider: string;
    status: string;
    wompi_transaction_id: string;
    wompi_transaction_status: string;
    payment_type: string;
    reference: string;
    currency: string;
    amount: number;
    signature_integrity: string;
}

export interface Affiliate {
    user: {
        first_name: string;
        last_name: string;
        document_type: string;
        document: string;
        email: string;
        phone_number: string;
        gender: string;
        password1: string;
        password2: string;
    };
    affiliate: {
        marital_status: string;
        birthdate: string;
        privacy_policy: boolean;
        terms_and_conditions: boolean;
        relationship: string;
    };
    plan_affiliation: {
        plan: string;
    };
    address: {
        name: string;
        address_detail: string;
        neighborhood: string;
    };
}

export interface Beneficiary {
    user: {
        first_name: string;
        last_name: string;
        document_type: string;
        document: string;
        email: string;
        phone_number: string;
        gender: string;
        password1: string;
        password2: string;
    };
    affiliate: {
        marital_status: string;
        birthdate: string;
        privacy_policy: boolean;
        terms_and_conditions: boolean;
        relationship: string;
    };
    plan_affiliation: {
        plan: string;
    };
    address: {
        name: string;
        address_detail: string;
        neighborhood: string;
    };
    parent_id: string;
}
