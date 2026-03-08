import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { GatewayService, User, UserSession } from '../../services/gateway.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  userSessions: UserSession[] = [];
  loading = true;
  error = '';
  
  // Filters
  userSearch = '';
  userFilter = '';
  
  // Modal states
  showCreateUserModal = false;
  showUserSessionsModal = false;
  
  // Form data
  newUser = {
    username: '',
    email: '',
    password: '',
    full_name: '',
    phone: '',
    address: '',
    is_admin: false
  };

  private subscriptions: Subscription[] = [];

  constructor(private gatewayService: GatewayService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadUsers(): void {
    this.loading = true;
    this.error = '';

    const sub = this.gatewayService.getUsers().subscribe({
      next: (users) => {
        console.log('Users received:', users);
        // Use setTimeout to ensure change detection happens in next tick
        setTimeout(() => {
          this.users = users;
          this.applyFilters();
          // Set loading to false immediately after data processing
          this.loading = false;
          // Force change detection to ensure UI updates
          this.cdr.detectChanges();
        }, 0);
      },
      error: (err) => {
        console.error('Error loading users:', err);
        // Use setTimeout to ensure change detection happens in next tick
        setTimeout(() => {
          this.error = 'Failed to load users';
          this.loading = false;
          // Force change detection to ensure UI updates
          this.cdr.detectChanges();
        }, 0);
      }
    });

    this.subscriptions.push(sub);
  }

  applyFilters(): void {
    console.log('applyFilters called');
    console.log('users array:', this.users);
    console.log('users length:', this.users.length);
    
    this.filteredUsers = this.users;

    if (this.userSearch) {
      this.filteredUsers = this.filteredUsers.filter(user =>
        user.username.toLowerCase().includes(this.userSearch.toLowerCase()) ||
        user.email.toLowerCase().includes(this.userSearch.toLowerCase())
      );
    }

    if (this.userFilter) {
      this.filteredUsers = this.filteredUsers.filter(user => {
        switch (this.userFilter) {
          case 'active': return user.is_active;
          case 'inactive': return !user.is_active;
          case 'admin': return user.is_admin;
          default: return true;
        }
      });
    }
    
    console.log('final filteredUsers:', this.filteredUsers);
    console.log('filteredUsers length:', this.filteredUsers.length);
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  toggleUserStatus(user: User): void {
    const action = user.is_active ? 'deactivate' : 'activate';
    if (!confirm(`Are you sure you want to ${action} this user?`)) return;

    const sub = this.gatewayService.toggleUserStatus(user.id, !user.is_active).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: (err) => {
        // Handle toggle user status error
      }
    });

    this.subscriptions.push(sub);
  }

  viewUserSessions(userId: string): void {
    const sub = this.gatewayService.getUserSessions(userId).subscribe({
      next: (sessions) => {
        this.userSessions = sessions;
        this.showUserSessionsModal = true;
      },
      error: (err) => {
        // Handle user sessions error
      }
    });

    this.subscriptions.push(sub);
  }

  createUser(): void {
    const sub = this.gatewayService.createUser(this.newUser).subscribe({
      next: () => {
        this.showCreateUserModal = false;
        this.resetNewUserForm();
        this.loadUsers();
      },
      error: (err) => {
        // Handle create user error
      }
    });

    this.subscriptions.push(sub);
  }

  editUser(user: User): void {
    // TODO: Implement edit user functionality
  }

  private resetNewUserForm(): void {
    this.newUser = {
      username: '',
      email: '',
      password: '',
      full_name: '',
      phone: '',
      address: '',
      is_admin: false
    };
  }

  formatDate(dateString: string): string {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString();
  }

  // Helper method for safe string operations
  getInitials(username: string): string {
    return username?.charAt(0)?.toUpperCase() || 'U';
  }
}
