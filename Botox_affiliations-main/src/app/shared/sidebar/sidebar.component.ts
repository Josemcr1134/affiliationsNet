import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
    public beneficiaries: any;
    public id: string = '';
    constructor(private activatedRoute: ActivatedRoute, private router: Router) {}

    ngOnInit(): void {
        this.activatedRoute.params.subscribe((resp: any) => {
            this.id = resp.id;
            this.router.navigate(['/Register/Plan', this.id]);
            localStorage.removeItem('parent_email');
            localStorage.removeItem('parent_data');
            localStorage.removeItem('Beneficiary');
            localStorage.removeItem('Regular_People');
            localStorage.removeItem('parent_id');
            localStorage.removeItem('Extra_people');
            // localStorage.removeItem('plan');
            // this.beneficiaries = beneficiaries;
        });
    }

    showSignUpForm() {
        if (localStorage.getItem('parent_id')) {
            Swal.fire('Oooops', 'La información no puede ser actualizada, por favor comuniquese con el administrador', 'error');
        }
    }

    goToPay() {
        if (localStorage.getItem('parent_id')) {
            this.router.navigate(['/Register/Plan', this.id, 'Payment']);
        } else {
            Swal.fire('Oooops', 'No se puede realizar el pago si no se ha creado el usuario.', 'error');
        }
    }
}
