import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { MaterialModule } from '../../shared/modules/material.module';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.scss',
})
export class ThemeToggleComponent implements OnInit, OnDestroy {
  isDark: boolean;
  private themeSubscription!: Subscription;

  constructor(private themeService: ThemeService) {
    this.isDark = this.themeService.getActiveTheme() === 'dark';
  }

  ngOnInit(): void {
    // Optionally, subscribe to theme changes if the service emits events
    // For example, if ThemeService uses an observable to notify theme changes
  }

  toggleTheme(event: any) {
    this.themeService.toggleTheme();
    this.isDark = this.themeService.getActiveTheme() === 'dark';
  }

  ngOnDestroy(): void {
    // Unsubscribe if you have any subscriptions
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }
}
