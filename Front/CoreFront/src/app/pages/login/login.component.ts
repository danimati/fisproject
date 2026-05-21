import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="w-full max-w-md space-y-8">
        <!-- Header -->
        <div class="text-center">
          <h2 class="text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p class="mt-2 text-sm text-gray-600">
            Or 
            <a href="/register" class="font-medium text-blue-600 hover:text-blue-500">
              create a new account
            </a>
          </p>
        </div>

        <!-- Login Form -->
        <form class="mt-8 space-y-6" (ngSubmit)="onSubmit($event)">
          <!-- Email Field -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <div class="mt-1">
              <input 
                id="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                [(ngModel)]="loginData.email"
                [ngModelOptions]="{standalone: true}"
                (ngModelChange)="onEmailChange($event)"
                class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <!-- Password Field -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div class="mt-1">
              <input 
                id="password"
                name="password"
                type="password"
                autocomplete="current-password"
                required
                [ngModel]="loginData.password"
                (ngModelChange)="onPasswordChange($event)"
                class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <!-- Remember Me & Forgot Password -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input 
                id="remember-me"
                name="remember-me"
                type="checkbox"
                [ngModel]="loginData.rememberMe"
                (ngModelChange)="onRememberMeChange($event)"
                class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div class="text-sm">
              <a href="/forgot-password" class="font-medium text-blue-600 hover:text-blue-500">
                Forgot your password?
              </a>
            </div>
          </div>

          <!-- Error Message -->
          <div *ngIf="errorMessage" class="rounded-md bg-red-50 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 0116 0zm-3 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 002 2h12a1 1 0 002-2V6a1 1 0 00-1-1H9a1 1 0 00-1 1v4a1 1 0 002 2h12a1 1 0 002-2V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">
                  Authentication failed
                </h3>
                <div class="mt-2 text-sm text-red-700">
                  {{ errorMessage }}
                </div>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div>
            <button 
              type="submit"
              [disabled]="isLoading"
              class="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span class="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg *ngIf="!isLoading" class="h-5 w-5 text-blue-500 group-hover:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a5 5 0 01-10 0v2a5 5 0 0110 0zm-4 6a1 1 0 110-2H4a1 1 0 00-1 1v10a1 1 0 001 1h2a1 1 0 001-1v10a1 1 0 002 2h2a1 1 0 002-2V5a1 1 0 012-2h2a1 1 0 012 2v14a1 1 0 01-2 2h-2a1 1 0 01-2-2z" clip-rule="evenodd" />
                </svg>
                <svg *ngIf="isLoading" class="animate-spin h-5 w-5 text-blue-500" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 10v4a8 8 0 11-16 0v-4a7.962 7.962 0 00-6 6.709V10a8 8 0 118 0v-4a8 8 0 01-8 8z"></path>
                </svg>
              </span>
              {{ isLoading ? 'Signing in...' : 'Sign in' }}
            </button>
          </div>
        </form>

        <!-- Alternative Login Options -->
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-gray-50 text-gray-500">Or continue with</span>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-2 gap-3">
            <button type="button" 
                    class="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              <svg class="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10 10-4.477 10-10S17.523 2 12 2zm3.584 15.217-3.584 2.027c-1.299 0-2.357-1.026-3.584-2.027l3.584 2.027c1.299 0 2.357 1.026 3.584 2.027z" />
              </svg>
              <span class="ml-2">Google</span>
            </button>

            <button type="button" 
                    class="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              <svg class="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                <path fill-rule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 13.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 5 5-2.24 5-5zm-4.5 0c-.83 0-1.5-.67-1.5-1.5S9.17 8.5 10 8.5s1.5.67 1.5 1.5zm2.5-7c-.28 0-.5-.22-.5-.5s-.5.22-.5.5.5.22.5.5.5.5-.22.5-.5.5.5-.22.5-.5zm-1 2c-.28 0-.5-.22-.5-.5s-.5.22-.5.5.5.22.5.5.5-.22.5-.5.5.5-.22.5-.5z" clip-rule="evenodd" />
              </svg>
              <span class="ml-2">Microsoft</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class LoginComponent {
  @Input() title = 'Login';
  @Output() loginSuccess = new EventEmitter<LoginFormData>();
  @Output() loginError = new EventEmitter<string>();

  loginData: LoginFormData = {
    email: '',
    password: '',
    rememberMe: false
  };

  isLoading = false;
  errorMessage = '';

  constructor(private router: Router) {}

  onEmailChange(email: string) {
    this.loginData.email = email;
    this.errorMessage = '';
  }

  onPasswordChange(password: string) {
    this.loginData.password = password;
    this.errorMessage = '';
  }

  onRememberMeChange(rememberMe: boolean) {
    this.loginData.rememberMe = rememberMe;
  }

  onSubmit(event: Event) {
    event.preventDefault();
    
    if (!this.loginData.email || !this.loginData.password) {
      this.errorMessage = 'Please enter both email and password';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
      
      // Simulate successful login
      if (this.loginData.email === 'admin@example.com' && this.loginData.password === 'password') {
        this.loginSuccess.emit(this.loginData);
        this.router.navigate(['/dashboard']);
      } else {
        this.errorMessage = 'Invalid email or password. Please try again.';
        this.loginError.emit(this.errorMessage);
      }
    }, 1500);
  }

  // Social login methods
  loginWithGoogle() {
    console.log('Login with Google');
    // Implement Google OAuth
  }

  loginWithMicrosoft() {
    console.log('Login with Microsoft');
    // Implement Microsoft OAuth
  }
}
