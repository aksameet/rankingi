import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { MaterialModule } from '../../shared/modules/material.module';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.scss',
})
export class ThemeToggleComponent {
  isDark: boolean;

  constructor(private themeService: ThemeService) {
    this.isDark = this.themeService.getActiveTheme() === 'dark';
  }

  toggleTheme(event: any) {
    this.themeService.toggleTheme();
    this.isDark = this.themeService.getActiveTheme() === 'dark';
  }
}
