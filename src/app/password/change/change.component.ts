import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/appServices/auth.service';

@Component({
  selector: 'app-change',
  templateUrl: './change.component.html',
  styleUrls: ['./change.component.scss']
})
export class ChangeComponent implements OnInit {
  
  token = JSON.parse(localStorage.getItem('userData'))._token
  Form : FormGroup;
  success:boolean=false;

  constructor(
    private fb: FormBuilder,
    private _authService:AuthService) {
  }
  ngOnInit(): void {

    this.Form = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    }, {validator: this.passwordMatchValidator})
  }
  passwordMatchValidator(g: FormGroup) {
    return g.get('password').value === g.get('confirmPassword').value
       ? null : {'mismatch': true};
  }
  onSubmit(){
    if(this.Form.valid){
      console.log(this.Form.value);
      const data = {idToken:this.token, ...this.Form.value};
      this._authService.changePassword(data).subscribe(res =>{
        console.log(res)
        this.success=true
      })
    }else{
      let key = Object.keys(this.Form.controls);
      key.filter(data =>{
        let control = this.Form.controls[data];
        if(control.errors !=null){
          control.markAsTouched();
        }
      })
    }
  }


}
