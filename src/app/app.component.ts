import { Component, OnInit } from '@angular/core';
import { AuthService } from './appServices/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  

  constructor(private _authService:AuthService){}

  ngOnInit(){
    this._authService.autoSignIn()
  }
}
