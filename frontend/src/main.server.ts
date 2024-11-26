import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

(function () {
  const originalConsoleLog = console.log;
  console.log = function (...args) {
    if (typeof window !== 'undefined') {
      originalConsoleLog.apply(console, args); // Wyświetlaj tylko w przeglądarce
    }
  };
})();

const bootstrap = () => bootstrapApplication(AppComponent, config);

export default bootstrap;
