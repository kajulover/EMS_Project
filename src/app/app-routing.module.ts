import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmpComponent } from './emp/emp.component';
import { ProfileComponent } from './profile/profile.component';
import { ChangeComponent } from './password/change/change.component';
import { ForgetComponent } from './password/forget/forget.component';
import { HomeComponent } from './home/home.component';


const routes: Routes = [
  {path : '', component:HomeComponent},
  {path : 'login', component:AuthComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'employee/:id', component: EmpComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'change-password', component: ChangeComponent},
  {path: 'forget-password', component: ForgetComponent},
  {path: '**', redirectTo: 'auth'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
