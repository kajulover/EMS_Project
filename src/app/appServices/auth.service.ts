import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { config } from '../config';
import { catchError, tap } from 'rxjs/operators';
import { ErrorService } from './error.service';
import { User } from '../appModels/user.model';
import { AuthResponse } from '../appInterface/auth-response-interface';
import { BehaviorSubject, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { SocialAuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // user = new Subject <User>();
  user = new BehaviorSubject <User>(null);
 profileInfo = new BehaviorSubject ({
  displayName:'',
  email:'',
  photoUrl:''
 })
 private tokenExpirationTimer:any


  constructor(private _http:HttpClient,
    private _errservice:ErrorService,
    private router: Router,
    private _socialAuthService:SocialAuthService) { }

  signUp(email, password){

    return this._http.post<AuthResponse>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + config.API_KEY,{
      email: email,
      password:password,
      returnSecureToken:true
    })
    .pipe(catchError(err => {
      return this._errservice.handleError(err)
    }),
    tap(res =>{
      this.authenticatedUser(res.email, res.localId, res.idToken, + res.expiresIn)
    })
    )
  }

  private authenticatedUser(email, userId, token, expiresIn){
    
    const expirationDate = new Date(new Date().getTime()+ expiresIn*1000);
    const user = new User (email, userId, token, expirationDate);
    console.log('user=>',user);
    this.user.next(user)
    this.autoSignOut(expiresIn * 1000)
    localStorage.setItem('userData',JSON.stringify(user))
    this.getUserData(token)
  }

  signIn(email,password){
    return this._http.post<AuthResponse>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + config.API_KEY,{
      email: email,
      password:password, 
      returnSecureToken:true
    }).pipe(catchError(err => {
      return this._errservice.handleError(err)
    }),
    tap(res =>{
      this.authenticatedUser(res.email, res.localId, res.idToken, + res.expiresIn)
    })
    )
  }

  signOut(){
    this.user.next(null)
    this.router.navigate([''])
    localStorage.removeItem("userData")
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer)
    }else{
      this.tokenExpirationTimer = null
    }
  }
 
  getUserData(token){
    return this._http.post<any>(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${config.API_KEY}`,{
      idToken:token
    })
    .subscribe(res =>{
      this.profileInfo.next({
        displayName:res.users[0].displayName,
        email:res.users[0].email,
        photoUrl:res.users[0].photoUrl
      })
    })
  }

  updateProfile(data){
    return this._http.post<any>('https://identitytoolkit.googleapis.com/v1/accounts:update?key=' + config.API_KEY,{
      idToken:data.token,
      displayName:data.name,
      photoUrl:data.picture,
      returnSecureToken:true
    })
    .pipe(catchError(err => {
      return this._errservice.handleError(err)
    }))
  }

  autoSignIn(){
    let userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return
    }
    const loggedInUser = new User(userData.email,userData.id,userData._token,new Date(userData._tokenExpirationDate))
    if (loggedInUser.token) {
      this.user.next(loggedInUser)
    }
  }
  
  autoSignOut(expirationDuration:number){
    this.tokenExpirationTimer = setTimeout(()=>{
      this.signOut()
    },
    expirationDuration)
  }

  changePassword(data){
    return this._http.post<any>('https://identitytoolkit.googleapis.com/v1/accounts:update?key='+ config.API_KEY,{
      idToken: data.idToken,
      password : data.password,
      returnSecureToken:true
    })
    .pipe(catchError(err =>{
      return this._errservice.handleError(err)
    }))
  }
  forgotPassword(data){
    return this._http.post<any>(`https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${config.API_KEY}`,{
      requestType:'PASSWORD_RESET',
      email:data.email
    })
    .pipe(catchError(err =>{
      return this._errservice.handleError(err)
    }))
  }

  signInWithGoogle(){
    return this._http.post<any>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithIdp?key=' + config.API_KEY,{
      postBody:'id_token=${token} &providerId=google.com',
      requestUri: 'http://localhost:4200',
      returnIdpCredential:true,
      returnSecureToken:true
    }) 

  }
}
