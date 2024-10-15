import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { ThemeToggleComponent } from '../components/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatButtonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  isLogIn$!: any;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.isLogIn$ = this.authService.isLoggedIn$;
  }

  navigateToProfiles() {
    this.router.navigate(['/profiles']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
