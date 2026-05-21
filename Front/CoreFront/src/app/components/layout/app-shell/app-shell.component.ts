import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface AppShellOptions {
  sidebarCollapsed?: boolean;
}

@Component({
  selector: 'app-app-shell',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex h-screen bg-gray-50">
      <!-- Sidebar -->
      <ng-content select="[sidebar]"></ng-content>
      
      <!-- Main Content -->
      <div class="flex flex-1 flex-col overflow-hidden">
        <!-- Header -->
        <ng-content select="[header]"></ng-content>
        
        <!-- Main Content Area -->
        <main class="flex-1 overflow-auto">
          <div class="p-6">
            <ng-content></ng-content>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
    }
  `]
})
export class AppShellComponent {
  @Input() options: AppShellOptions = {};
  @Output() sidebarToggle = new EventEmitter<boolean>();

  onSidebarToggle(collapsed: boolean) {
    this.sidebarToggle.emit(collapsed);
  }
}
