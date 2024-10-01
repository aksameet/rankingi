import { Component } from '@angular/core';
import { ProfileComponent } from './profile/profile.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ProfileComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {}
