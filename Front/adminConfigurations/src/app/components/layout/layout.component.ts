import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  sidebarCollapsed = false;
  notificationOpen = false;
  searchQuery = '';

  menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: 'fas fa-tachometer-alt', route: '/dashboard' },
    { id: 'users', name: 'User Management', icon: 'fas fa-users', route: '/users' },
    { id: 'security', name: 'Security', icon: 'fas fa-shield-alt', route: '/security' },
    { id: 'audit', name: 'Audit Logs', icon: 'fas fa-history', route: '/audit' },
    { id: 'roles', name: 'Roles & Permissions', icon: 'fas fa-user-lock', route: '/roles' },
    { id: 'performance', name: 'Performance', icon: 'fas fa-chart-line', route: '/performance' },
    { id: 'settings', name: 'Settings', icon: 'fas fa-cog', route: '/settings' }
  ];

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  logout(): void {
    this.authService.logout();
  }

  // Helper method for safe user display
  getUserInitials(): string {
    return this.authService.currentUser?.username?.charAt(0)?.toUpperCase() || 'A';
  }

  getUsername(): string {
    return this.authService.currentUser?.username || 'Admin';
  }
}
