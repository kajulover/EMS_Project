import { Component, OnInit } from '@angular/core';
import { AuthService } from '../appServices/auth.service';
import { Subject } from 'rxjs';
import { User } from '../appModels/user.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
  // loginMode:boolean = true;
  // user = new Subject <User>();
  user;
  constructor(private _authServices: AuthService,
    private activatedRoute:ActivatedRoute) {}

  ngOnInit(): void {
    this._authServices.user.subscribe((res) => {
      this.isLoggedIn = !!res;
    });
    this._authServices.profileInfo.subscribe((res) => {
      this.user = res;
    });
    this.activatedRoute.fragment.subscribe(res=>{
      console.log(res)
      this.jumpTo(res);
    })
  }

  onSignOut() {
    this._authServices.signOut();
  }

  jumpTo(section) {
    setTimeout(() => {
      document.getElementById(section).scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }
}
