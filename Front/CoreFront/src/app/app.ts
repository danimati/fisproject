import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Navigation Header -->
      <nav class="bg-white shadow-sm border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center space-x-8">
              <a href="/" class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                    <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002 2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002 2v14a2 2 0 01-2 2h-2a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <div class="ml-3">
                  <h1 class="text-xl font-bold text-gray-900">Maritime Logistics</h1>
                </div>
              </a>
            </div>
            
            <div class="flex items-center space-x-4">
              <a href="/login" 
                 class="rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium text-blue-600 shadow-sm hover:bg-blue-50">
                Login
              </a>
              <a href="/vessels" 
                 class="rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium text-blue-600 shadow-sm hover:bg-blue-50">
                Buques
              </a>
              <a href="/demo" 
                 class="rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium text-blue-600 shadow-sm hover:bg-blue-50">
                Demo
              </a>
              <a href="/dashboard" 
                 class="rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium text-blue-600 shadow-sm hover:bg-blue-50">
                Dashboard
              </a>
            </div>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class App {
  title = 'Maritime Logistics Management System';
}
