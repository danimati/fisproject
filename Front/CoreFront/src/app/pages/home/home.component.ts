import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Hero Section -->
      <section class="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="py-24 md:py-32">
            <div class="text-center">
              <h1 class="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                Maritime Logistics
                <span class="block text-blue-200">Management System</span>
              </h1>
              <p class="mt-3 max-w-md mx-auto text-base text-gray-100 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                Streamline your maritime operations with our comprehensive vessel, container, and shipment management platform.
              </p>
              <div class="mt-8 sm:mt-10">
                <a href="/login" 
                   class="inline-flex items-center justify-center rounded-md border border-transparent bg-white px-8 py-3 text-base font-medium text-blue-600 shadow-sm hover:bg-blue-50 sm:w-auto">
                  Get Started
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Background decoration -->
        <div class="absolute inset-0 -z-10 overflow-hidden">
          <svg class="absolute left-[max(50%,25rem)] top-0 h-[1024px] w-[1280px] -translate-x-1/2" 
               fill="none" stroke="white" stroke-width="2" viewBox="0 0 1920 1024">
            <defs>
              <pattern id="hero-pattern" x="0" y="0" width="160" height="160" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="40" height="40" fill="white" fill-opacity="0.1" />
              </pattern>
            </defs>
            <rect x="0" y="0" width="1920" height="1024" fill="url(#hero-pattern)" />
          </svg>
        </div>
      </section>

      <!-- Features Section -->
      <section class="py-12 bg-white sm:py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center">
            <h2 class="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Comprehensive Maritime Solutions
            </h2>
            <p class="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Everything you need to manage your maritime logistics operations efficiently.
            </p>
          </div>
          
          <div class="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <!-- Vessel Management -->
            <div class="pt-6">
              <div class="flow-root rounded-lg bg-blue-50 px-6 pb-8">
                <div class="-mt-6">
                  <div>
                    <span class="inline-flex items-center justify-center rounded-lg bg-blue-100 p-3 shadow-lg">
                      <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2 2z" />
                      </svg>
                    </span>
                  </div>
                  <h3 class="mt-8 text-lg font-medium text-gray-900 tracking-tight">Vessel Management</h3>
                  <p class="mt-5 text-base text-gray-500">
                    Track and manage your entire fleet with real-time status updates and maintenance scheduling.
                  </p>
                </div>
              </div>
            </div>

            <!-- Container Tracking -->
            <div class="pt-6">
              <div class="flow-root rounded-lg bg-green-50 px-6 pb-8">
                <div class="-mt-6">
                  <div>
                    <span class="inline-flex items-center justify-center rounded-lg bg-green-100 p-3 shadow-lg">
                      <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10m0 0l-8-4m8 4v10m-6 0a2 2 0 110-4h3m10 11a2 2 0 002 2h3m-6 0a2 2 0 002 2v4a2 2 0 002-2m0 0V9a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2 2z" />
                      </svg>
                    </span>
                  </div>
                  <h3 class="mt-8 text-lg font-medium text-gray-900 tracking-tight">Container Tracking</h3>
                  <p class="mt-5 text-base text-gray-500">
                    Monitor container locations, status, and utilization across all ports and vessels.
                  </p>
                </div>
              </div>
            </div>

            <!-- Shipment Management -->
            <div class="pt-6">
              <div class="flow-root rounded-lg bg-purple-50 px-6 pb-8">
                <div class="-mt-6">
                  <div>
                    <span class="inline-flex items-center justify-center rounded-lg bg-purple-100 p-3 shadow-lg">
                      <svg class="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2zm-6 0a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2zm0 0v8a2 2 0 002 2h2a2 2 0 002-2v4a2 2 0 002 2zm-6 4h6v2h2v-2H9z" />
                      </svg>
                    </span>
                  </div>
                  <h3 class="mt-8 text-lg font-medium text-gray-900 tracking-tight">Shipment Management</h3>
                  <p class="mt-5 text-base text-gray-500">
                    End-to-end shipment tracking with real-time updates and comprehensive reporting.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Stats Section -->
      <section class="bg-gray-50 py-12 sm:py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center">
            <h2 class="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Trusted by Maritime Industry Leaders
            </h2>
            <p class="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Join thousands of logistics professionals who trust our platform.
            </p>
          </div>
          
          <div class="mt-12 grid grid-cols-2 gap-8 lg:grid-cols-4">
            <div class="text-center">
              <div class="text-3xl font-bold text-blue-600">500+</div>
              <div class="mt-2 text-sm font-medium text-gray-900">Vessels Managed</div>
            </div>
            
            <div class="text-center">
              <div class="text-3xl font-bold text-green-600">10K+</div>
              <div class="mt-2 text-sm font-medium text-gray-900">Containers Tracked</div>
            </div>
            
            <div class="text-center">
              <div class="text-3xl font-bold text-purple-600">50+</div>
              <div class="mt-2 text-sm font-medium text-gray-900">Global Ports</div>
            </div>
            
            <div class="text-center">
              <div class="text-3xl font-bold text-orange-600">99.9%</div>
              <div class="mt-2 text-sm font-medium text-gray-900">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="bg-blue-600">
        <div class="max-w-2xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div class="text-center">
            <h2 class="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Ready to Transform Your Maritime Operations?
            </h2>
            <p class="mt-6 mx-auto max-w-2xl text-lg text-blue-100">
              Get started today and experience the power of comprehensive maritime logistics management.
            </p>
            <a href="/login" 
               class="mt-8 inline-flex w-full justify-center rounded-md border border-transparent bg-white px-8 py-3 text-base font-medium text-blue-600 shadow-sm hover:bg-blue-50 sm:w-auto">
              Get Started Now
            </a>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class HomeComponent {
  @Input() title = 'Maritime Logistics Management';
  @Output() navigateToLogin = new EventEmitter<void>();

  onGetStarted() {
    this.navigateToLogin.emit();
  }
}
