import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Beneficiary } from 'src/app/models/beneficiarie.model';
import { Parent } from 'src/app/models/parent.model';
import { LocationService } from 'src/app/services/location.service';
import { PlanService } from '../../services/plan.service';
import { DocTypesService } from '../../services/doc-types.service';
import { AffiliationsService } from '../../services/affiliations.service';
import Swal from 'sweetalert2';
import { GenderService } from '../../services/gender.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
    public parent_id: string = '';
    public email_status: boolean = false;
    public id: string = '';
    public test_email = /^\w+([\.\+\-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
    public Parent: Parent[] = [];
    public Beneficiaries: Beneficiary[] = [];
    public plan_name: string = '';
    public plan_extra_affiliate_fee: number = 0;
    public regular_affiliates: number = 0;
    public extra_affiliates: number = 0;
    public extra_selected_people: any;
    public max_affiliates: number = 0;
    public without_extra: number = 0;

    public Countries: any[] = [];
    public Dpts: any[] = [];
    public Municipalities: any[] = [];
    public Neighborhoods: any[] = [];
    public Documents: any[] = [];
    public Genders: any[] = [];
    public maritalStatusList: any[] = [];
    public country: string = '';
    public dpt: string = '';
    public municipality: string = '';
    public loading: boolean = false;
    public neighborhoodLimit: number = 2000;
    public neighborhoodOffset: number = 0;

    openModalTerms: boolean = false;
    openModalPrivacy: boolean = false;
    enabledToPay: boolean = false;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private planSvc: PlanService,
        private locationSvc: LocationService,
        private docTypesSvc: DocTypesService,
        private affiliationsSvc: AffiliationsService,
        private genderSvc: GenderService
    ) {}

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((resp: any) => {
            this.id = resp.id;
        });
        this.GetPlanById();
        this.GetCountries();
        this.GetDocTypes();
        this.GetGenders();
        this.GetMaritalStatus();
        this.Parent = [
            {
                user: {
                    first_name: '',
                    last_name: '',
                    document_type: '',
                    document: '',
                    email: '',
                    gender: '',
                    phone_number: '',
                    password1: '',
                    password2: '',
                },
                affiliate: {
                    marital_status: '',
                    birthdate: '',
                    privacy_policy: false,
                    terms_and_conditions: false,
                    relationship: 'Titular',
                },
                plan_affiliation: {
                    plan: this.id,
                },
                address: {
                    name: '',
                    address_detail: '',
                    neighborhood: '',
                },
            },
        ];
        // this.AddBeneficiary();
        // this.loading = false;
    }
    //

    checkCanPay() {}

    responseTermAndConditions(reponse: boolean): void {
        this.Parent[0].affiliate.terms_and_conditions = reponse;
        this.openModalTerms = !this.openModalTerms;
    }

    responsePrivacyPolicies(reponse: boolean): void {
        this.Parent[0].affiliate.privacy_policy = reponse;
        this.openModalPrivacy = !this.openModalPrivacy;
    }

    saveHeadlineAffiliate(aff: any, goToPay: boolean, addBeneficiary: boolean) {
        const parentEmail = localStorage.getItem('parent_email');
        if (parentEmail === null) {
            this.Affiliate(aff, addBeneficiary);
        } else if (goToPay && this.enabledToPay) {
            this.GoToPay();
        } else {
            this.loading = !this.loading;
            this.AddBeneficiary();
        }
    }

    saveBeneficiary(beneficiary: any, addBeneficiary: boolean) {
        beneficiary.parent_id = this.parent_id;
        this.Affiliate(beneficiary, addBeneficiary);
    }

    Affiliate(a: any, addBeneficiary: boolean) {
        this.loading = !this.loading;
        this.affiliationsSvc.Affiliate(a).subscribe({
            error: (err: any) => {
                this.loading = !this.loading;
                if (err.error.user.email[0]) {
                    Swal.fire('Oooops', 'Este email ya se encuentra registrado', 'error');
                } else if (err.error.user.phone_number[0]) {
                    Swal.fire('Oooops', 'Este celular ya se encuentra registrado', 'error');
                } else if (err.error.user.document[0]) {
                    Swal.fire('Oooops', 'Este número de documento ya se encuentra registrado', 'error');
                } else {
                    Swal.fire('Oooops', 'No pudimos completar tu registro, revisa los campos y vuelve a intentarlo', 'error');
                }
            },
            next: (resp: any) => {
                if (addBeneficiary) {
                    this.AddBeneficiary();
                } else {
                    localStorage.setItem('parent_email', a.user.email);
                    this.GoToPay();
                }
                if (a.affiliate.relationship === 'Titular') {
                    this.GetParentID(a.user.email);
                    this.enabledToPay = true;
                    localStorage.setItem('parent_data', JSON.stringify(a));
                } else {
                    console.log('ya existe parent');
                }
            },
        });
    }

    AddBeneficiary() {
        const beneficiary: Beneficiary = {
            user: {
                first_name: '',
                last_name: '',
                document_type: '',
                document: '',
                email: '',
                gender: '',
                phone_number: '',
                password1: '',
                password2: '',
            },
            affiliate: {
                marital_status: '',
                birthdate: '',
                privacy_policy: true,
                terms_and_conditions: true,
                relationship: '',
            },
            plan_affiliation: {
                plan: this.id,
            },
            address: {
                name: '',
                address_detail: '',
                neighborhood: '',
            },
            parent_id: localStorage.getItem('parent_id') || this.parent_id,
        };
        this.Beneficiaries.push(beneficiary);
        localStorage.setItem('Beneficiary', this.Beneficiaries.length.toString());
        this.loading = !this.loading;
    }

    DeleteBeneficiary(b: any) {
        this.loading = !this.loading;
        this.Beneficiaries = this.Beneficiaries.filter((bs) => bs !== b);
        this.loading = !this.loading;
    }

    // VALIDATE EMAIL
    validateEmail(email: string) {
        return (this.email_status = /^\w+([\.\+\-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(email));
    }

    GoToPay() {
        if (this.Beneficiaries.length + this.Parent.length < this.max_affiliates) {
            localStorage.setItem('Regular_People', `${this.Beneficiaries.length + this.Parent.length}`);
            localStorage.setItem('Extra_people', this.without_extra.toString());
        } else if (this.Beneficiaries.length + this.Parent.length === this.max_affiliates) {
            localStorage.setItem('Regular_People', `${this.Beneficiaries.length + this.Parent.length - this.extra_affiliates}`);
            localStorage.setItem('Extra_people', `${this.Beneficiaries.length + this.Parent.length - this.regular_affiliates}`);
        }
        this.loading = !this.loading;
        this.router.navigateByUrl(`/Register/Plan/${this.id}/Payment`);
    }

    GetPlanById() {
        this.planSvc.GetPlan(this.id).subscribe({
            error: (err: any) => {
                console.log(err);
            },
            next: (resp: any) => {
                this.plan_name = resp.name;
                this.plan_extra_affiliate_fee = resp.extra_affiliate_fee;
                this.regular_affiliates = resp.max_affiliates;
                this.extra_affiliates = resp.max_extra_affiliates;
                this.max_affiliates = resp.max_affiliates + resp.max_extra_affiliates;
                localStorage.setItem('plan', resp.id);
            },
        });
    }

    GetCountries() {
        this.locationSvc.GetCountries().subscribe({
            error: (err: any) => {
                console.log(err);
            },
            next: (resp: any) => {
                this.Countries = resp.results;
            },
        });
    }

    GetDpt(country: string) {
        this.locationSvc.GetDepartments(country).subscribe({
            error: (err: any) => {
                console.log(err);
            },
            next: (resp: any) => {
                this.Dpts = resp.results;
            },
        });
    }

    GetMunicipality(dpt: string) {
        this.locationSvc.GetMunicipality(dpt).subscribe({
            error: (err: any) => {
                console.log(err);
            },
            next: (resp: any) => {
                this.Municipalities = resp.results;
            },
        });
    }

    GetNeighborhood(municipality: string) {
        this.locationSvc.GetNeighborhood(municipality, this.neighborhoodLimit, this.neighborhoodOffset).subscribe({
            error: (err: any) => {
                console.log(err);
            },
            next: (resp: any) => {
                this.Neighborhoods = resp.results;
            },
        });
    }

    GetDocTypes() {
        this.docTypesSvc.GetDocTypes().subscribe({
            error: (err: any) => {
                console.log(err);
            },
            next: (resp: any) => {
                this.Documents = resp.results;
            },
        });
    }

    GetGenders() {
        this.genderSvc.GetGenders().subscribe({
            error: (err: any) => {
                console.log(err);
            },
            next: (resp: any) => {
                this.Genders = resp.results;
            },
        });
    }

    GetMaritalStatus() {
        this.genderSvc.GetMaritalStatus().subscribe({
            error: (err: any) => {
                console.log(err);
            },
            next: (resp: any) => {
                this.maritalStatusList = resp.results;
            },
        });
    }

    GetParentID(email: string) {
        this.affiliationsSvc.GetParentID(email).subscribe({
            error: (err: any) => {
                console.log(err);
            },
            next: (resp: any) => {
                this.parent_id = resp.id;
                localStorage.setItem('parent_id', resp.id);
                localStorage.setItem('parent_email', email);
                console.log(this.parent_id);
            },
        });
    }
}
