import { Component, Input, Output, EventEmitter, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <div class="flex h-screen bg-white shadow-lg transition-all duration-300" 
         [class]="collapsed ? 'w-16' : 'w-64'">
      
      <!-- Header -->
      <div class="flex h-16 items-center justify-between px-4">
        <h1 *ngIf="!collapsed" class="text-xl font-bold text-gray-900">Maritime Log</h1>
        <button (click)="toggleSidebar()" 
                class="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      
      <!-- Navigation -->
      <nav class="mt-8">
        <ul class="space-y-2 px-2">
          <li *ngFor="let item of navigationItems">
            <a [routerLink]="item.href" 
               routerLinkActive="bg-primary-100 text-primary-700"
               class="group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900">
              <svg class="h-5 w-5" [class]="collapsed ? 'mx-auto' : 'mr-3'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="item.iconPath" />
              </svg>
              <span *ngIf="!collapsed">{{ item.name }}</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  `,
  styles: [`
    .router-link-active {
      background-color: #dbeafe;
      color: #1d4ed8;
    }
  `]
})
export class SidebarComponent implements OnInit {
  @Input() collapsed = false;
  @Output() sidebarToggle = new EventEmitter<boolean>();

  navigationItems = [
    { name: 'Dashboard', href: '/dashboard', iconPath: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Vessels', href: '/vessels', iconPath: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 2m0 18l5.447-2.724A1 1 0 0015 16.382V5.618a1 1 0 00-.553-.894L15 4m0 14V2m0 0L9 2' },
    { name: 'Containers', href: '/containers', iconPath: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10m0 0l-8-4m8 4v10m0 0l-8-4' },
    { name: 'Shipments', href: '/shipments', iconPath: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4' },
    { name: 'Clients', href: '/clients', iconPath: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2a3 3 0 00-5.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2a3 3 0 015.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { name: 'Routes & Ports', href: '/routes', iconPath: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 2m0 18l5.447-2.724A1 1 0 0015 16.382V5.618a1 1 0 00-.553-.894L15 4m0 14V2m0 0L9 2' },
    { name: 'Finance', href: '/finance', iconPath: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v8m0 0c1.11 0 2.08-.402 2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { name: 'Settings', href: '/settings', iconPath: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c-.94 1.543.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c.94-1.543-.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }
  ];

  ngOnInit() {
    // Initialize sidebar state from localStorage or service
  const savedState = localStorage.getItem('sidebar-collapsed');
    if (savedState !== null) {
      this.collapsed = savedState === 'true';
    }
  }

  toggleSidebar() {
    this.collapsed = !this.collapsed;
    this.sidebarToggle.emit(this.collapsed);
    localStorage.setItem('sidebar-collapsed', this.collapsed.toString());
  }
}
