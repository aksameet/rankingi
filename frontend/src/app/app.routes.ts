import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './home/login/login.component';
import { ProfileComponent } from './home/manage-profile/profile.component';
import { AuthGuard } from './services/auth/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'profiles', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
];
