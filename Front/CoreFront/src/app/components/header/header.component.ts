import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <!-- Left side -->
        <div class="flex items-center">
          <button (click)="sidebarToggle.emit()" 
                  class="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 lg:hidden">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div class="ml-4 lg:ml-0">
            <h2 class="text-lg font-semibold text-gray-900">{{ title }}</h2>
          </div>
        </div>

        <!-- Center - Search -->
        <div class="hidden md:block flex-1 max-w-lg mx-8">
          <div class="relative">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              type="text" 
              placeholder="Search..." 
              class="block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm"
              (input)="onSearchInput($event)"
              [value]="searchQuery"
            >
          </div>
        </div>

        <!-- Right side -->
        <div class="flex items-center space-x-4">
          <!-- Notifications -->
          <button class="relative rounded-md p-1 text-gray-400 hover:text-gray-500">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span *ngIf="notificationCount > 0" 
                  class="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
              {{ notificationCount }}
            </span>
          </button>

          <!-- User Menu -->
          <div class="relative">
            <button (click)="toggleUserMenu()" 
                    class="flex items-center rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
              <img class="h-8 w-8 rounded-full" 
                   [src]="userAvatar" 
                   [alt]="userName">
              <ng-template #userInitials>
                <div class="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-medium">
                  {{ getUserInitials() }}
                </div>
              </ng-template>
              
              <span class="ml-2 hidden md:block">{{ userName }}</span>
              <svg class="ml-1 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- User Dropdown -->
            <div *ngIf="showUserMenu" 
                 class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</a>
              <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
              <hr class="my-1">
              <button (click)="onLogout()" 
                      class="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
  `]
})
export class HeaderComponent {
  @Input() title = 'Dashboard';
  @Input() userName = 'John Doe';
  @Input() userAvatar = '';
  @Input() notificationCount = 0;
  @Output() sidebarToggle = new EventEmitter<void>();
  @Output() search = new EventEmitter<string>();
  @Output() logout = new EventEmitter<void>();

  showUserMenu = false;
  searchQuery = '';

  onSearchInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchQuery = target.value;
    this.search.emit(this.searchQuery);
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  getUserInitials(): string {
    return this.userName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  }

  onLogout() {
    this.showUserMenu = false;
    this.logout.emit();
  }

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative')) {
      this.showUserMenu = false;
    }
  }
}
