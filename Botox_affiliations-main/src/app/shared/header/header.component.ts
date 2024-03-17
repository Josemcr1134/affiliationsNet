import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlanService } from 'src/app/services/plan.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public beneficiaries:any;
  public id:string = '';
  public plan_name:string = '';
  
  constructor( private activatedRoute:ActivatedRoute, private planSvc:PlanService ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((resp:any) => {
        this.id = resp.id
      // this.beneficiaries = beneficiaries;
      this.GetPlanById();
      localStorage.setItem('plan', resp.id);
    });
  }

  GetPlanById(){
    this.planSvc.GetPlan(this.id)
          .subscribe({
            error:(err:any) =>{ 
              console.log(err);
            }, 
            next:(resp:any) => { 
              this.plan_name = resp.name; 
            }
          })
  }
}
