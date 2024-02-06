import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Employee } from '../appModels/employee.model';
import { DesignUtilityService } from '../appServices/design-utility.service';
import { AuthService } from '../appServices/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  listViewActive = false;
  showModal = false;
  empForm: FormGroup;
  user;

  empData: Employee[] = [
    // { id: 1, name: 'Anil', designation: 'Frontend Developer', dept: 'Development', status: 'Active' },
    // { id: 2, name: 'Sunil;', designation: 'Angular Developer', dept: 'Development', status: 'Active' },
    // { id: 3, name: 'Jony', designation: 'Web Designer', dept: 'Design', status: 'Active' },
    // { id: 4, name: 'Rahul', designation: 'Java Developer', dept: 'Development', status: 'Inactive' },
    // { id: 5, name: 'Ankit', designation: 'Hr Manager', dept: 'Hr', status: 'Active' },
    // { id: 6, name: 'Raj', designation: 'Admin Manager', dept: 'Admin', status: 'Active' }
  ];

  constructor(
    private fb: FormBuilder,
    private _designUtility: DesignUtilityService,
    private _authService: AuthService
  ) {
    this._authService.profileInfo.subscribe((res) => {
      this.user = res;
    });
  }

  ngOnInit(): void {
    this.onGetUsers();
    this.empForm = this.fb.group({
      name: ['', Validators.required],
      designation: ['', Validators.required],
      dept: ['Development', Validators.required],
      status: ['Active'],
    });
    
  }

  onEmpSubmit() {
    if (this.empForm.valid) {
      console.log(this.empForm.value);
      this._designUtility.saveData({
        name: this.empForm.value.name,
        designation: this.empForm.value.designation,
        dept: this.empForm.value.dept,
        status: this.empForm.value.status,
      })
      .subscribe(res=> console.log(res),
        err=>console.log(err)
      )

      this.empData.push({
        id: this.empData.length + 1,
        name: this.empForm.value.name,
        designation: this.empForm.value.designation,
        dept: this.empForm.value.dept,
        status: this.empForm.value.status,
      });
      console.log(this.empData);
      this.showModal = false;

      this.empForm.reset({
        dept: 'Development',
        status: 'Active',
      });
    } else {
      let key = Object.keys(this.empForm.controls);
      // console.log(key);

      key.filter((data) => {
        // console.log(data);
        let control = this.empForm.controls[data];
        // console.log(control);
        if (control.errors != null) {
          control.markAsTouched();
        }
      });
    }
  }

  onAddEmployee() {
    this.showModal = true;
  }
  onCloseModal() {
    this.showModal = false;
  }

  onGetUsers() {
    this._designUtility.fetchData().subscribe(
      (Response) => {
        const data = JSON.stringify(Response);
        console.log(data);
        this.empData = Response;
      },
      (err) => console.log(err)
    );
  }
  onDeleteEmployee(userId) {
    console.log(userId);
    if (confirm('Do You Want To Delete this employee')) {
      this._designUtility.deleteEmployee(userId).subscribe((res) => {
        console.log(res), (err) => console.log(err);
        this.onGetUsers();
      });
    }
  }
}
