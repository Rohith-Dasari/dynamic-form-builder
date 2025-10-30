import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

interface User {
  email: string;
  password: string;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userSignal = signal<User | null>(null);
  private router = inject(Router);
  private users = [
    { email: 'admin@gmail.com', password: 'admin123', role: 'admin' },
    { email: 'customer@gmail.com', password: 'customer123', role: 'user' },
  ];

  constructor() {
    const localUser = localStorage.getItem('currentUser');

    if (localUser) {
      this.userSignal.set(JSON.parse(localUser) as User);
    }
  }

  getEmail(): string {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.email;
    }
    return '';
  }

  login(email: string, password: string): User | null {
    const user = this.users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      localStorage.setItem('role', user.role);
      localStorage.setItem(
        'currentUser',
        JSON.stringify({ email: user.email, role: user.role })
      );
      this.userSignal.set(user);
      this.router.navigate([user.role === 'admin' ? '/builder' : '/form']);
      return user;
    }
    return null;
  }

  isLoggedIn(): Boolean {
    if (localStorage.getItem('currentUser')) {
      return true;
    } else {
      return false;
    }
  }

  getRole(): string | null {
    return this.userSignal()?.role ?? localStorage.getItem('role');
  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('role');
    this.userSignal.set(null);
    this.router.navigate(['/login']);
  }
}
