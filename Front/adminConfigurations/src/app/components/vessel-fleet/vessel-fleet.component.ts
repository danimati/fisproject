import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { VesselService, Vessel as ApiVessel } from '../../services/vessel.service';

export interface Vessel {
  id: string;
  name: string;
  vesselId: string;
  capacity: string;
  flag: string;
  status: 'active' | 'transit' | 'in_dock' | 'maintenance';
  icon: string;
  registryYear?: string;
}

export interface FilterOption {
  id: string;
  label: string;
  type: 'status' | 'country' | 'capacity';
  active: boolean;
  options: string[];
}

export interface NewVesselForm {
  name: string;
  capacity: number;
  flag: string;
  registryYear: string;
  status: 'ACTIVE' | 'IN_DOCK';
}

@Component({
  selector: 'app-vessel-fleet',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vessel-fleet.component.html',
  styleUrls: ['./vessel-fleet.component.css']
})
export class VesselFleetComponent implements OnInit, OnDestroy {
  vessels: Vessel[] = [];
  filteredVessels: Vessel[] = [];
  searchQuery = '';
  showAddPanel = false;
  showDetailsPanel = false;
  loading = true;
  error = '';
  activeVesselsCount = 0;
  selectedVessel: ApiVessel | null = null;
  detailsLoading = false;
  detailsError = '';

  filters: FilterOption[] = [
    {
      id: 'status',
      label: 'Status: Active',
      type: 'status',
      active: true,
      options: ['Active', 'Transit', 'In Dock', 'Maintenance']
    },
    {
      id: 'country',
      label: 'Country: All',
      type: 'country',
      active: false,
      options: ['All', 'Denmark', 'Panama', 'Switzerland', 'Singapore', 'Germany', 'China']
    },
    {
      id: 'capacity',
      label: 'Capacity',
      type: 'capacity',
      active: false,
      options: ['Small (<10k TEU)', 'Medium (10k-20k TEU)', 'Large (>20k TEU)']
    }
  ];

  newVesselForm: NewVesselForm = {
    name: '',
    capacity: 0,
    flag: 'Denmark',
    registryYear: new Date().getFullYear().toString(),
    status: 'ACTIVE'
  };

  constructor(
    private router: Router,
    private vesselService: VesselService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadMockData();
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  loadMockData(): void {
    try {
      this.loading = true;
      this.error = '';

      this.vesselService.getVessels().subscribe({
        next: (response) => {
          this.vessels = response.items.map((apiVessel: ApiVessel) => ({
            id: apiVessel.id,
            name: apiVessel.name,
            vesselId: apiVessel.imo_number,
            capacity: apiVessel.max_containers ? `${apiVessel.max_containers} TEU` : `${apiVessel.deadweight_tonnage.toLocaleString()} DWT`,
            flag: apiVessel.flag_country,
            status: apiVessel.status.toLowerCase() as 'active' | 'transit' | 'in_dock' | 'maintenance',
            icon: 'directions_boat',
            registryYear: new Date(apiVessel.created_at).getFullYear().toString()
          }));

          this.filteredVessels = [...this.vessels];
          this.activeVesselsCount = this.vessels.filter(v => v.status === 'active').length;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.error = 'Failed to load vessel data. Please try again.';
          this.cdr.detectChanges();
        },
        complete: () => {
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    } catch (error) {
      this.error = 'Failed to load vessel data. Please try again.';
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  onSearch(): void {
    const query = this.searchQuery.toLowerCase().trim();
    
    if (!query) {
      this.applyFilters();
      return;
    }

    this.filteredVessels = this.vessels.filter(vessel =>
      vessel.name.toLowerCase().includes(query) ||
      vessel.vesselId.toLowerCase().includes(query) ||
      vessel.flag.toLowerCase().includes(query)
    );
  }

  applyFilters(): void {
    this.filteredVessels = [...this.vessels];
    
    // Apply search filter if exists
    if (this.searchQuery) {
      this.onSearch();
      return;
    }

    // Apply status filter
    const statusFilter = this.filters.find(f => f.type === 'status' && f.active);
    if (statusFilter && statusFilter.label !== 'Status: All') {
      const status = statusFilter.label.replace('Status: ', '').toLowerCase().replace(' ', '_');
      this.filteredVessels = this.filteredVessels.filter(vessel => vessel.status === status);
    }

    // Apply country filter
    const countryFilter = this.filters.find(f => f.type === 'country' && f.active);
    if (countryFilter && countryFilter.label !== 'Country: All') {
      const country = countryFilter.label.replace('Country: ', '');
      this.filteredVessels = this.filteredVessels.filter(vessel => vessel.flag === country);
    }

    // Apply capacity filter
    const capacityFilter = this.filters.find(f => f.type === 'capacity' && f.active);
    if (capacityFilter) {
      const capacityRange = capacityFilter.label;
      this.filteredVessels = this.filteredVessels.filter(vessel => {
        const capacity = parseInt(vessel.capacity.replace(/[^\d]/g, ''));
        if (capacityRange.includes('<10k')) return capacity < 10000;
        if (capacityRange.includes('10k-20k')) return capacity >= 10000 && capacity <= 20000;
        if (capacityRange.includes('>20k')) return capacity > 20000;
        return true;
      });
    }
  }

  toggleFilter(filterId: string): void {
    const filter = this.filters.find(f => f.id === filterId);
    if (filter) {
      // Reset other filters of same type
      this.filters.forEach(f => {
        if (f.type === filter.type && f.id !== filterId) {
          f.active = false;
        }
      });
      
      // Toggle current filter
      filter.active = !filter.active;
      
      this.applyFilters();
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'transit':
        return 'bg-blue-500';
      case 'in_dock':
        return 'bg-amber-500';
      case 'maintenance':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  }

  getStatusTextColor(status: string): string {
    switch (status) {
      case 'active':
        return 'text-green-600';
      case 'transit':
        return 'text-blue-600';
      case 'in_dock':
        return 'text-amber-600';
      case 'maintenance':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  }

  getStatusText(status: string): string {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  editVessel(vessel: Vessel): void {
    // In a real app, this would open edit modal or navigate to edit page
    // For now, just log the vessel
    console.log('Edit vessel:', vessel.name);
  }

  viewVesselDetails(vessel: Vessel): void {
    this.showDetailsPanel = true;
    this.detailsLoading = true;
    this.detailsError = '';
    this.selectedVessel = null;

    this.vesselService.getVesselById(vessel.id).subscribe({
      next: (apiVessel) => {
        this.selectedVessel = apiVessel;
      },
      error: (err) => {
        this.detailsError = 'Failed to load vessel details. Please try again.';
      },
      complete: () => {
        this.detailsLoading = false;
      }
    });
  }

  closeDetailsPanel(): void {
    this.showDetailsPanel = false;
    this.selectedVessel = null;
    this.detailsError = '';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  deactivateVessel(vessel: Vessel): void {
    // In a real app, this would show confirmation and deactivate vessel
    console.log('Deactivate vessel:', vessel.name);
  }

  openAddPanel(): void {
    this.showAddPanel = true;
    this.resetNewVesselForm();
  }

  closeAddPanel(): void {
    this.showAddPanel = false;
    this.resetNewVesselForm();
  }

  resetNewVesselForm(): void {
    this.newVesselForm = {
      name: '',
      capacity: 0,
      flag: 'Denmark',
      registryYear: new Date().getFullYear().toString(),
      status: 'ACTIVE'
    };
  }

  createVessel(): void {
    if (!this.newVesselForm.name || this.newVesselForm.capacity <= 0) {
      return;
    }

    const newVessel: Vessel = {
      id: (this.vessels.length + 1).toString(),
      name: this.newVesselForm.name.toUpperCase(),
      vesselId: `VSL-${Math.floor(Math.random() * 9999)}-${this.newVesselForm.flag.slice(0, 2).toUpperCase()}`,
      capacity: `${this.newVesselForm.capacity.toLocaleString()} TEU`,
      flag: this.newVesselForm.flag,
      status: this.newVesselForm.status.toLowerCase() as 'active' | 'transit' | 'in_dock' | 'maintenance',
      icon: 'directions_boat',
      registryYear: this.newVesselForm.registryYear
    };

    this.vessels.unshift(newVessel);
    this.applyFilters();
    this.closeAddPanel();

    // Update active count
    if (newVessel.status === 'active') {
      this.activeVesselsCount++;
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  navigateToContainers(): void {
    // In a real app, this would navigate to containers page
    console.log('Navigate to containers');
  }

  navigateToRoutes(): void {
    // In a real app, this would navigate to routes page
    console.log('Navigate to routes');
  }

  navigateToSettings(): void {
    // In a real app, this would navigate to settings page
    console.log('Navigate to settings');
  }

  trackByVesselId(index: number, vessel: Vessel): string {
    return vessel.id;
  }
}
