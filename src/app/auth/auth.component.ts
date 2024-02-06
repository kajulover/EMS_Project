import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../appServices/auth.service';
import { AuthResponse } from '../appInterface/auth-response-interface';
import { Observable } from 'rxjs/internal/Observable';
import { ErrorService } from '../appServices/error.service';
import { Subject } from 'rxjs';
import { User } from '../appModels/user.model';
import { SocialAuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  loginMode: boolean = true;
  error;
  errMsgs = this._errService.errorMsgs;
  Form: FormGroup;
  user = new Subject<User>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _authService: AuthService,
    private _errService: ErrorService,
    private _socialAuthService:SocialAuthService
  ) {}

  ngOnInit(): void {
    this.Form = this.fb.group({
      email: [
        '',
        [Validators.required, Validators.email],
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this._authService.user.subscribe(res =>{
      if (res){
        this.router.navigate(['/dashboard'])
      }
    })
  }

  onModeSwitch() {
    this.loginMode = !this.loginMode;
  }

  // onSubmit() {
  //   if (this.Form.valid) {
  //     console.log(this.Form.value);
  //     const email = this.Form.value.email;
  //     const password = this.Form.value.password;
  //     if (this.loginMode) {
  //       this._authService.signIn(email, password).subscribe(
  //         (res) => {
  //           console.log(res);
  //         },
  //         (err) => {
  //           console.log(err);
  //         }
  //       );
  //     } else {
  //       this._authService.signUp(email, password).subscribe(
  //         (res) => {
  //           console.log(res);
  //         },
  //         (err) => {
  //           console.log(err);
  //         }
  //       );
  //     }
  //   }
  // }

  onSubmit() {
    if (this.Form.valid) {
      // console.log(this.Form.value);
      const email = this.Form.value.email;
      const password = this.Form.value.password;
      let authObservable: Observable<AuthResponse>;
      if (this.loginMode) {
        authObservable = this._authService.signIn(email, password);
      } else {
        authObservable = this._authService.signUp(email, password);
      }
      authObservable.subscribe(
        (res) => {
          console.log(res);
          this.router.navigate(['dashboard']);
        },
        (err) => {
          // console.log(err);
          // this.error = this.errMsgs[err.error.error.message]
          // // this.error = err.error.error.message;

          // if (!err.error || !err.error.error) {
          //   this.error = this.errMsgs['UNKNOWN']
          // } else {
          //   this.error = this.errMsgs[err.error.error.message]
          // }

          this.error = err;
    
        }
      );
    }
  }

  // onGoogleSignIn(){
  //   this._socialAuthService.sig
  // }
}
