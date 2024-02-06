import { Component, OnInit } from '@angular/core';
import { Employee } from '../appModels/employee.model';
import { DesignUtilityService } from '../appServices/design-utility.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../appServices/auth.service';


@Component({
  selector: 'app-emp',
  templateUrl: './emp.component.html',
  styleUrls: ['./emp.component.scss']
})
export class EmpComponent implements OnInit {

  editMode:any = false;

  constructor(private _designUtility: DesignUtilityService, 
    private activatedRoute: ActivatedRoute,
    private fb:FormBuilder,
    private _authService:AuthService) { }

  emp: Employee;
  // emp: Employee  { id: 3, name: '', designation: '', dept: '', status: ''};
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(param => {
      console.log(param.get('id'))
      this._designUtility.fetchSingleEmployee(param.get('id')).subscribe(res =>{
        console.log(res)
        this.emp = res
      })
    })
  }



  
}
