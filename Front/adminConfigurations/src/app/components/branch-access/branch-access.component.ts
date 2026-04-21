import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

export interface Permission {
  module: string;
  read: boolean;
  write: boolean;
  delete: boolean;
  audit: boolean;
}

export interface AccessUser {
  id: string;
  name: string;
  employeeId: string;
  branch: string;
  role: string;
  avatar?: string;
  permissions: Permission[];
  expanded?: boolean;
}

export interface Branch {
  id: string;
  name: string;
  active: boolean;
}

@Component({
  selector: 'app-branch-access',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './branch-access.component.html',
  styleUrls: ['./branch-access.component.css']
})
export class BranchAccessComponent implements OnInit, OnDestroy {
  branches: Branch[] = [];
  users: AccessUser[] = [];
  selectedBranch: Branch | null = null;
  loading = true;
  error = '';
  lastModified: {
    user: string;
    timestamp: string;
  } = {
    user: 'Admin_04',
    timestamp: '2023-10-27 14:30 GMT'
  };

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadMockData();
  }

  loadMockData(): void {
    try {
      this.loading = true;
      this.error = '';
      
      // Mock branches
      this.branches = [
      { id: 'all', name: 'All Branches', active: true },
      { id: 'singapore', name: 'Singapore Terminal', active: false },
      { id: 'hamburg', name: 'Hamburg Port', active: false },
      { id: 'dubai', name: 'Dubai Jebel Ali', active: false }
    ];

    // Mock users with permissions
    this.users = [
      {
        id: '1',
        name: 'Alexander Chen',
        employeeId: 'MSC-8842',
        branch: 'Singapore',
        role: 'Manager',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJZNGEjWEXkfN5WbduXn1yWbzYh8x_VoukbA70ZhvmX4dVEOEJKcOEHbxPMeSw_ONInQFZkK48bBhr7dZmGl_PBDdMgJcDRxRnVm4YekIOjG25eKOXE9Kwg82CUhn_W4sX29ywTlDZq8CyB5EgyP3S5hPAVcMPpUm4p0U4xJVEVYL2BNNkzhpdA28TGzeVocNECBacDuNmliJjehq3TOScjAE14lX4otSxHWN61bfU9KEEuwIsk9Erl5fMRXYo8DIVqyxrzB9xnTQ',
        expanded: true,
        permissions: [
          { module: 'Vessel Tracking', read: true, write: true, delete: false, audit: true },
          { module: 'Container Manifests', read: true, write: true, delete: true, audit: true },
          { module: 'Global Logistics', read: true, write: false, delete: false, audit: false }
        ]
      },
      {
        id: '2',
        name: 'Sarah Jenkins',
        employeeId: 'MSC-1120',
        branch: 'Hamburg Port',
        role: 'Auditor',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPxb4fu9T86kViXBmWhslYhbBOv8hF1WA2abRveMDDNEeTwyyidIzloR-AEP4UKbuj5DOyFBx0D_jlq7DVQ8js9jaFY_Lfhj4B_cxfD_hvfOwg6siiwdeTSrkKOQ6ur4AKbDMEa1Q6VpBpJPOKaPbT0hsh5-umTmQpN9K5hbZgFGjG-eYjY69e-AlKlH7acQdj73H_dYHQNGuZ5IfZ6KcIf9DGydhRyi9mvWD834UoVm-hiQ2UmO-u45ezQHT9WO82yYstgT45lcs',
        expanded: false,
        permissions: [
          { module: 'Vessel Tracking', read: true, write: false, delete: false, audit: true },
          { module: 'Container Manifests', read: true, write: false, delete: false, audit: true },
          { module: 'Global Logistics', read: false, write: false, delete: false, audit: false }
        ]
      },
      {
        id: '3',
        name: 'Marcus Vane',
        employeeId: 'MSC-0012',
        branch: 'Global Head',
        role: 'Admin',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-TgCEP6i-I_Yvh6D3yzGhtTgy7b-rhlbw-ZcO3l56w3MsFJWFINY9HFevPS9YV5fPbJHm4vCPkmXwV00e95ev7F3ASfk4eJ9g_yzve-Gs-BMZOsTblXNpb0GHlKRRzoI3n2BHhJlAYHeMjN9aVUXQMcuLOY3TfUZIfsZjWh7nlO9xdi_0shl2SH_XdBGSQa-QSSfWn8HfZI7pHCa0HOYoY89bE5HC8QNjJlQl_syU0wl7i7-fv2QXx6JK2Car5xbWrDbO1P96JTA',
        expanded: false,
        permissions: [
          { module: 'Vessel Tracking', read: true, write: true, delete: true, audit: true },
          { module: 'Container Manifests', read: true, write: true, delete: true, audit: true },
          { module: 'Global Logistics', read: true, write: true, delete: true, audit: true }
        ]
      },
      {
        id: '4',
        name: 'Elena Petrov',
        employeeId: 'MSC-9901',
        branch: 'Dubai Jebel Ali',
        role: 'Operator',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBArtSHTcaog4S8qxL8B7JsF11C_9BN4UMLREKzHxAgWYG3CDq7V_fMHiRaapriDYqxiiFmRS2l7n8EAdk4ir1NC7wze5GtV3EdP8y5fV7W_NhJ4vA4vg5eEw9Vsu6JKP3f9T0n7X5VDm46iqDwxmQXYIr6VC-V4boLHgYnmUX6uXmo5JNnYaMWUkPkB9rBd2WyniHE3FkmtiieMKvvKmc7eAiQOcLCo7uzzSNFJNsgrE7wZWO6EgRzIqEKPJ-QwxkMolbB0ovUORY',
        expanded: false,
        permissions: [
          { module: 'Vessel Tracking', read: true, write: false, delete: false, audit: false },
          { module: 'Container Manifests', read: true, write: false, delete: false, audit: false },
          { module: 'Global Logistics', read: false, write: false, delete: false, audit: false }
        ]
      }
    ];

    this.selectedBranch = this.branches[0];
    } catch (error) {
      this.error = 'Failed to load data. Please try again.';
      console.error('Error loading mock data:', error);
    } finally {
      this.loading = false;
    }
  }

  selectBranch(branch: Branch): void {
    this.branches.forEach(b => b.active = false);
    branch.active = true;
    this.selectedBranch = branch;
  }

  toggleUserExpanded(user: AccessUser): void {
    // Close all other users first
    this.users.forEach(u => {
      if (u.id !== user.id) {
        u.expanded = false;
      }
    });
    user.expanded = !user.expanded;
  }

  updatePermission(user: AccessUser, permissionIndex: number, permissionType: keyof Permission, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    user.permissions[permissionIndex][permissionType] = checkbox.checked;
  }

  saveChanges(): void {
    // Update last modified info
    this.lastModified = {
      user: 'Admin_04',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16) + ' GMT'
    };
    
    // In a real app, this would save to backend
    console.log('Changes saved:', this.users);
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  trackByUserId(index: number, user: AccessUser): string {
    return user.id;
  }

  getRoleBadgeClass(role: string): string {
    const baseClass = 'px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide';
    
    switch (role.toLowerCase()) {
      case 'admin':
        return `${baseClass} bg-blue-600 text-white`;
      case 'manager':
        return `${baseClass} bg-primary/10 text-primary`;
      case 'auditor':
        return `${baseClass} bg-gray-100 text-gray-600`;
      case 'operator':
        return `${baseClass} bg-green-100 text-green-700`;
      default:
        return `${baseClass} bg-gray-100 text-gray-600`;
    }
  }
}
