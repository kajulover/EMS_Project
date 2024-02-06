import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../appServices/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  Form : FormGroup;
  editMode:boolean = true;
  profileInfo;
  token = JSON.parse(localStorage.getItem('userData'))._token;


  constructor(
    private fb: FormBuilder,
    private router:Router,
    private activatedRoute:ActivatedRoute,
    private _authService:AuthService) {
      this._authService.profileInfo.subscribe(res =>{
        this.profileInfo = res;
      })
  }
  

  ngOnInit(): void {
    this.Form = this.fb.group({
      name: ['Edit Name'],
      picture: ['Edit Photo']
    })

    this.activatedRoute.queryParamMap.subscribe(res=>{
      let qParams = res.get('EditMode');

      if(qParams !=null){
        this.editMode = true;
      }else{
        this.editMode = false;
      }
    })
    this._authService.profileInfo.subscribe(res =>{
      this.profileInfo = res;
      this.Form.setValue({
        name:res.displayName,
        picture:res.photoUrl
      })
    })
    
    setTimeout(() => {
      this.Form.setValue({
        name: this.profileInfo.displayName,
        picture: this.profileInfo.photoUrl
      })
    }, 1000);

  }
  onSubmit(){
    if(this.Form.valid){
      console.log(this.Form.value);
      const uData = {token:this.token,...this.Form.value}
      this._authService.updateProfile(uData)
      .subscribe(res =>{
        this._authService.getUserData(this.token)
      },
      err => console.log(err))
      

    }else{

      let key = Object.keys(this.Form.controls);
      // console.log(key);

      key.filter(data =>{
        // console.log(data);
        let control = this.Form.controls[data];
        // console.log(control);
        if(control.errors !=null){
          control.markAsTouched();
        }
      })
    }
  }

   

  onDiscard(){
    // this.Form.reset();
    this.router.navigate([], {queryParams: {EditMode:null}})
  }

}
