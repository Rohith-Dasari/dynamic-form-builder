import { Component, inject, computed } from '@angular/core';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'dynamic-form-builder';
  
  private authService = inject(AuthService);
  
  isAuthenticated = computed(() => this.authService.userSignal() !== null);
  userEmail = computed(() => this.authService.userSignal()?.email ?? '');

  logout() {
    this.authService.logout();
  }
}
