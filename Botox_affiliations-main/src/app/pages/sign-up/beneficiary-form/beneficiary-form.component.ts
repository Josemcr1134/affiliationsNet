import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { DocTypesService } from 'src/app/services/doc-types.service';
import { GenderService } from 'src/app/services/gender.service';
import { LocationService } from 'src/app/services/location.service';
import { PasswordValidator } from '../password.validator';
import { ConfirmedValidator } from 'src/app/shared/global';
import { Plan } from 'src/app/services/plan.service';
import { AffiliateForm, AffiliationsService, Beneficiary } from 'src/app/services/affiliations.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-beneficiary-form',
    templateUrl: './beneficiary-form.component.html',
    styleUrls: ['./beneficiary-form.component.css'],
})
export class BeneficiaryFormComponent implements OnInit {
    @Input() planSelected!: Plan;
    @Input() beneficiaryToEdit: AffiliateForm | null = null;
    @Output() closeBeneficiaryModal: EventEmitter<boolean> = new EventEmitter();
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
    loading: boolean = false;

    beneficiaryForm: FormGroup = this.formBuilder.group(
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
            // privacy_policy: [true],
            // terms_and_conditions: [true],
            relationship: ['', [Validators.required]],
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
        if (this.beneficiaryToEdit != null) {
            this.loading = true;
            // Load de beneficiary to edit
            this.beneficiaryForm.patchValue(this.beneficiaryToEdit);
            this.getStates(this.beneficiaryToEdit.country, true);
            this.getMunicipality(this.beneficiaryToEdit.department, true);
            this.getNeighborhood(this.beneficiaryToEdit.municipality, true);
            this.loading = false;
        }
        this.getDocTypes();
        this.getGenders();
        this.getMaritalStatus();
        this.getCountries();
    }

    get beneficiaryFormControls(): { [key: string]: AbstractControl } {
        return this.beneficiaryForm.controls;
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
                        this.beneficiaryFormControls.department.setValue('');
                        this.beneficiaryFormControls.municipality.setValue('');
                        this.beneficiaryFormControls.neighborhood.setValue('');
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
                        this.beneficiaryFormControls.municipality.setValue('');
                        this.beneficiaryFormControls.neighborhood.setValue('');
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
                        this.beneficiaryFormControls.neighborhood.setValue('');
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

    saveBeneficiary() {
        if (this.beneficiaryForm.valid) {
            this.loading = true;
            const beneficiaryFormData = this.beneficiaryForm.value as AffiliateForm;
            beneficiaryFormData.terms_and_conditions = true;
            beneficiaryFormData.privacy_policy = true;
            beneficiaryFormData.plan = this.planSelected.id;
            if (this.beneficiaryToEdit === null) {
                this.affiliateService.addBeneficiary(beneficiaryFormData);
            } else {
                this.affiliateService.updateBeneficiary(this.beneficiaryToEdit, beneficiaryFormData);
            }
            //Process time is updated
            localStorage.setItem('processStartedOn', new Date().toString());
            this.closeBeneficiaryModal.emit(true);
            this.loading = false;
        }
    }

    closeModal() {
        this.closeBeneficiaryModal.emit(true);
    }
}
