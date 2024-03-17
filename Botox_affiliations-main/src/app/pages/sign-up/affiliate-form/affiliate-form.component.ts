import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DocTypesService } from 'src/app/services/doc-types.service';
import { GenderService } from 'src/app/services/gender.service';
import { LocationService } from 'src/app/services/location.service';
import { Plan } from 'src/app/services/plan.service';
import Swal from 'sweetalert2';
import { PasswordValidator } from '../password.validator';
import { differenceInMinutes } from 'date-fns';
import { ConfirmedValidator } from 'src/app/shared/global';
import { Affiliate, AffiliateForm, AffiliationsService } from 'src/app/services/affiliations.service';

@Component({
    selector: 'app-affiliate-form',
    templateUrl: './affiliate-form.component.html',
    styleUrls: ['./affiliate-form.component.css'],
})
export class AffiliateFormComponent implements OnInit {
    @Input() planSelected!: Plan;
    @Output() isOpenMainAffiliateForm: EventEmitter<boolean> = new EventEmitter();
    constructor(
        private formBuilder: FormBuilder,
        private locationSvc: LocationService,
        private docTypesSvc: DocTypesService,
        private genderSvc: GenderService,
        private affiliateService: AffiliationsService
    ) {}

    countries: any[] = [];
    states: any[] = [];
    municipalities: any[] = [];
    neighborhoods: any[] = [];
    documentTypes: any[] = [];
    genders: any[] = [];
    maritalStatuses: any[] = [];
    openModalTerms: boolean = false;
    openModalPrivacy: boolean = false;
    loading: boolean = false;
    showMainAffiliateCard: boolean = false;

    affiliatesForm: FormGroup = this.formBuilder.group(
        {
            document_type: ['', [Validators.required]],
            document_number: ['', [Validators.required]],
            first_name: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]*$/)]],
            last_name: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]*$/)]],
            email: ['', [Validators.required, Validators.email]],
            phone_number: ['', [Validators.required, Validators.pattern(/^[0-9]{5,100}$/)]],
            gender: ['', [Validators.required]],
            password1: ['', [Validators.required, Validators.minLength(8), PasswordValidator.strong]],
            password2: ['', [Validators.required]],
            marital_status: ['', [Validators.required]],
            birthdate: ['', [Validators.required]],
            privacy_policy: [false, [Validators.requiredTrue]],
            terms_and_conditions: [false, [Validators.requiredTrue]],
            relationship: ['Titular'],
            address: ['', [Validators.required]],
            address_detail: ['', [Validators.required]],
            country: ['', [Validators.required]],
            department: ['', [Validators.required]],
            municipality: ['', [Validators.required]],
            neighborhood: ['', [Validators.required]],
        },
        {
            validator: ConfirmedValidator('password1', 'password2'),
        }
    );

    ngOnInit(): void {
        this.getDocTypes();
        this.getGenders();
        this.getMaritalStatus();
        this.getCountries();
        this.checkDataSaved();
    }

    get affiliatesFormControls(): { [key: string]: AbstractControl } {
        return this.affiliatesForm.controls;
    }

    editMainAffiliate() {
        this.showMainAffiliateCard = false;
        this.isOpenMainAffiliateForm.emit(true);
    }

    checkDataSaved() {
        this.loading = true;
        const processStartedOn = localStorage.getItem('processStartedOn');
        if (processStartedOn) {
            const currentDate = new Date();
            const processStartedOnDate = new Date(processStartedOn);
            const minutes: number = differenceInMinutes(currentDate, processStartedOnDate);
            if (minutes > 10) {
                if (minutes > 10 && minutes <= 15) {
                    Swal.fire('Oops!', 'Se agotó el tiempo de espera para registrarse. Debe comenzar el proceso nuevamente.', 'warning');
                }
                // TODO: Descomentar esto.
                this.affiliateService.removeAllData();
                localStorage.removeItem('processStartedOn');
                this.showMainAffiliateCard = false;
            } else {
                this.affiliateService.getCurrentMainAffiliate().subscribe((data) => {
                    if (data.document_number) {
                        this.getStates(data.country, true);
                        this.getMunicipality(data.department, true);
                        this.getNeighborhood(data.municipality, true);
                        this.affiliatesForm.patchValue(data);
                        this.showMainAffiliateCard = true;
                        this.isOpenMainAffiliateForm.emit(false);
                    }
                });
            }
        }
        // Simulation of a load state
        setTimeout(() => {
            this.loading = false;
        }, 1250);
    }

    getCountries() {
        this.locationSvc.GetCountries().subscribe({
            error: (err: any) => {
                Swal.fire('Oops!', 'No se pudo obtener el listado de países', 'error');
            },
            next: (resp: any) => {
                this.countries = resp.results;
            },
        });
    }

    getStates(country: string, loadingAffiliateToEdit: boolean = false) {
        if (country != '') {
            this.locationSvc.GetDepartments(country).subscribe({
                error: (err: any) => {
                    Swal.fire('Oops!', 'No se pudo obtener el listado de departamentos', 'error');
                },
                next: (resp: any) => {
                    this.states = resp.results;
                    if (!loadingAffiliateToEdit) {
                        this.municipalities = [];
                        this.neighborhoods = [];
                        this.affiliatesFormControls.department.setValue('');
                        this.affiliatesFormControls.municipality.setValue('');
                        this.affiliatesFormControls.neighborhood.setValue('');
                    }
                },
            });
        }
    }

    getMunicipality(state: string, loadingAffiliateToEdit: boolean = false) {
        if (state != '') {
            this.locationSvc.GetMunicipality(state).subscribe({
                error: (err: any) => {
                    Swal.fire('Oops!', 'No se pudo obtener el listado de municipios', 'error');
                },
                next: (resp: any) => {
                    this.municipalities = resp.results;
                    if (!loadingAffiliateToEdit) {
                        this.neighborhoods = [];
                        this.affiliatesFormControls.municipality.setValue('');
                        this.affiliatesFormControls.neighborhood.setValue('');
                    }
                },
            });
        }
    }

    getNeighborhood(municipality: string, loadingAffiliateToEdit: boolean = false) {
        if (municipality != '') {
            this.locationSvc.GetNeighborhood(municipality, 2000, 0).subscribe({
                error: (err: any) => {
                    Swal.fire('Oops!', 'No se pudo obtener el listado de barrios', 'error');
                },
                next: (resp: any) => {
                    this.neighborhoods = resp.results;
                    if (!loadingAffiliateToEdit) {
                        this.affiliatesFormControls.neighborhood.setValue('');
                    }
                },
            });
        }
    }

    getDocTypes() {
        this.docTypesSvc.GetDocTypes().subscribe({
            error: (err: any) => {
                Swal.fire('Oops!', 'No se pudo obtener el listado de tipos de documentos', 'error');
            },
            next: (resp: any) => {
                this.documentTypes = resp.results;
            },
        });
    }

    getGenders() {
        this.genderSvc.GetGenders().subscribe({
            error: (err: any) => {
                Swal.fire('Oops!', 'No se pudo obtener el listado de generos', 'error');
            },
            next: (resp: any) => {
                this.genders = resp.results;
            },
        });
    }

    getMaritalStatus() {
        this.genderSvc.GetMaritalStatus().subscribe({
            error: (err: any) => {
                Swal.fire('Oops!', 'No se pudo obtener el listado de Estados civiles', 'error');
            },
            next: (resp: any) => {
                this.maritalStatuses = resp.results;
            },
        });
    }

    responseTermAndConditions(reponse: boolean): void {
        this.affiliatesFormControls.terms_and_conditions.setValue(reponse);
        this.openModalTerms = !this.openModalTerms;
    }

    responsePrivacyPolicies(reponse: boolean): void {
        this.affiliatesFormControls.privacy_policy.setValue(reponse);
        this.openModalPrivacy = !this.openModalPrivacy;
    }

    saveAffiliate() {
        if (this.affiliatesForm.valid) {
            this.loading = true;
            const mainAffiliateFormData = this.affiliatesForm.value as AffiliateForm;
            mainAffiliateFormData.plan = this.planSelected.id;
            this.affiliateService.setMainAffiliate(mainAffiliateFormData);
            localStorage.setItem('processStartedOn', new Date().toString());
            this.showMainAffiliateCard = true;
            setTimeout(() => {
                this.isOpenMainAffiliateForm.emit(false);
                this.loading = false;
            }, 1800);
        }
    }
}
