// src/app/services/theme.service.ts
import {
  Injectable,
  Renderer2,
  RendererFactory2,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { StorageService } from './storage.service'; // If using StorageService

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private renderer: Renderer2;
  private darkThemeClass = 'dark-theme';
  private lightThemeClass = 'light-theme';
  private currentTheme: 'light' | 'dark' = 'light';
  private isBrowser: boolean;

  constructor(
    private rendererFactory: RendererFactory2,
    private storageService: StorageService, // If using StorageService
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document // Inject DOCUMENT
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.initializeTheme();
  }

  private initializeTheme() {
    let savedTheme: 'light' | 'dark' | null = null;

    if (this.isBrowser) {
      savedTheme = this.storageService.getItem('theme') as
        | 'light'
        | 'dark'
        | null;
    }

    if (savedTheme) {
      this.setTheme(savedTheme);
    } else {
      const prefersDark = this.isBrowser
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
        : false;
      this.setTheme(prefersDark ? 'dark' : 'light');
    }

    // Listen for system theme changes
    if (this.isBrowser) {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', (e) => {
          const prefersDark = e.matches;
          const savedTheme = this.storageService.getItem('theme') as
            | 'light'
            | 'dark'
            | null;
          if (!savedTheme) {
            this.setTheme(prefersDark ? 'dark' : 'light');
          }
        });
    }
  }

  setTheme(theme: 'light' | 'dark') {
    if (!this.isBrowser) return; // Exit if not in browser

    const body = this.document.body;
    if (theme === 'dark') {
      this.renderer.removeClass(body, this.lightThemeClass);
      this.renderer.addClass(body, this.darkThemeClass);
      this.currentTheme = 'dark';
    } else {
      this.renderer.removeClass(body, this.darkThemeClass);
      this.renderer.addClass(body, this.lightThemeClass);
      this.currentTheme = 'light';
    }

    this.storageService.setItem('theme', theme);
  }

  toggleTheme() {
    this.setTheme(this.currentTheme === 'light' ? 'dark' : 'light');
  }

  getActiveTheme(): 'light' | 'dark' {
    return this.currentTheme;
  }
}
