import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/appServices/auth.service';

@Component({
  selector: 'app-forget',
  templateUrl: './forget.component.html',
  styleUrls: ['./forget.component.scss']
})
export class ForgetComponent implements OnInit {
   error :null;
   success:boolean = false;
  constructor(
    private fb: FormBuilder,
    private _authService:AuthService) {
  }
  forgetForm : FormGroup;

  ngOnInit(): void {

    this.forgetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    })
  }
  onForgetSubmit(){
    if (this.forgetForm.valid) {
      
      this._authService.forgotPassword(this.forgetForm.value).subscribe(res=>{
        console.log(res)
        this.success = true
      },
      err =>{
        console.log(err)
        this.error = err
      })
      
    }else{
      let key = Object.keys(this.forgetForm.controls);
      key.filter(data =>{
        let control = this.forgetForm.controls[data];
        if(control.errors !=null){
          control.markAsTouched();
        }
      })
    }
  }


}
