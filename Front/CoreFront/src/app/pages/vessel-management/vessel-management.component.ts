import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppShellComponent } from '../../components/layout/app-shell/app-shell.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { HeaderComponent } from '../../components/header/header.component';
import { ButtonComponent } from '../../components/ui/button/button.component';
import { InputComponent } from '../../components/ui/input/input.component';
import { SelectComponent, type SelectOption } from '../../components/ui/select/select.component';
import { TableComponent, TableColumn } from '../../components/ui/table/table.component';
import { PaginationComponent, type PaginationOptions } from '../../components/ui/pagination/pagination.component';
import { StatsCardComponent } from '../../components/dashboard/stats-card/stats-card.component';

interface Vessel {
  id: string;
  name: string;
  imoNumber: string;
  flagState: string;
  type: string;
  capacityTeu: number;
  status: 'active' | 'inactive' | 'maintenance' | 'in_transit';
}

@Component({
  selector: 'app-vessel-management',
  standalone: true,
  imports: [
    CommonModule,
    AppShellComponent,
    SidebarComponent,
    HeaderComponent,
    ButtonComponent,
    InputComponent,
    SelectComponent,
    TableComponent,
    PaginationComponent,
    StatsCardComponent
  ],
  template: `
    <app-app-shell (sidebarToggle)="onSidebarToggle($event)">
    <div sidebar>
      <app-sidebar [collapsed]="sidebarCollapsed" (sidebarToggle)="onSidebarToggle($event)"></app-sidebar>
    </div>
    
    <div header>
      <app-header 
        title="Vessel Management"
        (sidebarToggle)="onHeaderSidebarToggle()"
        (search)="onSearch($event)">
      </app-header>
    </div>
    
    <!-- Main Content -->
    <div class="space-y-6">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <app-stats-card 
          [data]="{
            title: 'Total Vessels',
            value: vesselStats.total,
            change: { value: vesselStats.active, type: 'increase' },
            icon: 'ship',
            color: 'blue'
          }">
        </app-stats-card>
        
        <app-stats-card 
          [data]="{
            title: 'Active Vessels',
            value: vesselStats.active,
            change: { value: 2, type: 'increase' },
            icon: 'activity',
            color: 'green'
          }">
        </app-stats-card>
        
        <app-stats-card 
          [data]="{
            title: 'In Maintenance',
            value: vesselStats.maintenance,
            change: { value: 1, type: 'decrease' },
            icon: 'tool',
            color: 'yellow'
          }">
        </app-stats-card>
        
        <app-stats-card 
          [data]="{
            title: 'In Transit',
            value: vesselStats.inTransit,
            change: { value: 3, type: 'neutral' },
            icon: 'location',
            color: 'purple'
          }">
        </app-stats-card>
      </div>

      <!-- Filters -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
        <app-input 
          label="Search vessels..."
          placeholder="Enter vessel name or IMO number..."
          [(value)]="searchQuery"
          (valueChange)="onSearchChange($event)">
        </app-input>
        
        <app-select 
          label="Status Filter"
          placeholder="All Statuses"
          [value]="statusFilter"
          [options]="statusOptions"
          (valueChange)="onStatusFilterChange($event)">
        </app-select>
        
        <div class="flex justify-end">
          <app-button 
            content="Clear Filters"
            variant="outline"
            (buttonClick)="clearFilters()">
          </app-button>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-between">
        <h2 class="text-xl font-bold text-gray-900">Vessel Fleet</h2>
        <app-button 
          content="Add Vessel"
          variant="primary"
          (buttonClick)="addVessel()">
        </app-button>
      </div>

      <!-- Table -->
      <app-table 
        [data]="filteredVessels"
        [columns]="vesselColumns"
        [loading]="loading"
        [sortKey]="sortKey"
        [sortDirection]="sortDirection"
        (sort)="onSort($event)"
        (rowClick)="viewVessel($event)"
        emptyMessage="No vessels found matching your criteria">
      </app-table>

      <!-- Pagination -->
      <app-pagination 
        [options]="paginationOptions"
        (pageChange)="onPageChange($event)"
        (pageSizeChange)="onPageSizeChange($event)">
      </app-pagination>
    </div>
    </app-app-shell>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
    }
  `]
})
export class VesselManagementComponent {
  sidebarCollapsed = false;
  loading = false;
  searchQuery = '';
  statusFilter = '';
  sortKey: keyof Vessel = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';
  currentPage = 1;
  pageSize = 20;

  vessels: Vessel[] = [
    {
      id: '1',
      name: 'MV Neptune',
      imoNumber: '9876545',
      flagState: 'Panama',
      type: 'Container Ship',
      capacityTeu: 10000,
      status: 'active'
    },
    {
      id: '2',
      name: 'MV Atlantic',
      imoNumber: '9876546',
      flagState: 'Liberia',
      type: 'Container Ship',
      capacityTeu: 12000,
      status: 'in_transit'
    },
    {
      id: '3',
      name: 'MV Pacific',
      imoNumber: '9876547',
      flagState: 'Marshall Islands',
      type: 'Container Ship',
      capacityTeu: 8000,
      status: 'maintenance'
    }
  ];

  statusOptions: SelectOption[] = [
    { value: '', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'in_transit', label: 'In Transit' }
  ];

  vesselColumns: TableColumn<Vessel>[] = [
    {
      key: 'name',
      title: 'Vessel Name',
      sortable: true,
      render: (value: string, record: Vessel) => `
        <div class="font-medium text-gray-900">${value}</div>
        <div class="text-sm text-gray-500">IMO: ${record.imoNumber}</div>
      `
    },
    {
      key: 'type',
      title: 'Type',
      render: (value: string) => `<span class="badge badge-secondary">${value}</span>`
    },
    {
      key: 'capacityTeu',
      title: 'Capacity (TEU)',
      align: 'right',
      render: (value: number) => value.toLocaleString()
    },
    {
      key: 'flagState',
      title: 'Flag State'
    },
    {
      key: 'status',
      title: 'Status',
      render: (value: string) => {
        const variantMap = {
          active: 'success',
          inactive: 'secondary',
          maintenance: 'warning',
          in_transit: 'info'
        };
        return `<span class="badge badge-${variantMap[value as keyof typeof variantMap]}">${value.replace('_', ' ')}</span>`;
      }
    },
    {
      key: 'actions' as keyof Vessel,
      title: 'Actions',
      render: (_: any, record: Vessel) => `
        <div class="flex space-x-2">
          <button class="btn btn-sm btn-outline" onclick="window.location.href='/vessels/${record.id}'">View</button>
          <button class="btn btn-sm" onclick="window.location.href='/vessels/${record.id}/edit'">Edit</button>
        </div>
      `
    }
  ];

  get vesselStats() {
    return {
      total: this.vessels.length,
      active: this.vessels.filter(v => v.status === 'active').length,
      maintenance: this.vessels.filter(v => v.status === 'maintenance').length,
      inTransit: this.vessels.filter(v => v.status === 'in_transit').length
    };
  }

  get filteredVessels() {
    let filtered = this.vessels;
    
    if (this.searchQuery) {
      filtered = filtered.filter(vessel => 
        vessel.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        vessel.imoNumber.includes(this.searchQuery)
      );
    }
    
    if (this.statusFilter) {
      filtered = filtered.filter(vessel => vessel.status === this.statusFilter);
    }
    
    return filtered;
  }

  get paginationOptions(): PaginationOptions {
    const filtered = this.filteredVessels;
    return {
      currentPage: this.currentPage,
      totalPages: Math.ceil(filtered.length / this.pageSize),
      pageSize: this.pageSize,
      totalItems: filtered.length
    };
  }

  onSidebarToggle(collapsed: boolean) {
    this.sidebarCollapsed = collapsed;
  }

  onHeaderSidebarToggle() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  onSearch(query: string) {
    this.searchQuery = query;
    this.currentPage = 1;
  }

  onSearchChange(query: string) {
    this.searchQuery = query;
    this.currentPage = 1;
  }

  onStatusFilterChange(value: string | number) {
    this.statusFilter = String(value);
    this.currentPage = 1;
  }

  clearFilters() {
    this.searchQuery = '';
    this.statusFilter = '';
    this.currentPage = 1;
  }

  onSort(event: { key: keyof Vessel; direction: 'asc' | 'desc' }) {
    this.sortKey = event.key;
    this.sortDirection = event.direction;
    
    // Simple sort implementation
    this.filteredVessels.sort((a, b) => {
      const aVal = a[event.key];
      const bVal = b[event.key];
      
      if (aVal < bVal) return event.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return event.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }

  onPageSizeChange(pageSize: number) {
    this.pageSize = pageSize;
    this.currentPage = 1;
  }

  addVessel() {
    console.log('Navigate to add vessel form');
  }

  viewVessel(event: any) {
    const vessel = event as Vessel;
    console.log('Navigate to vessel details:', vessel);
  }
}
