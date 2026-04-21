import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

export interface HistoryEvent {
  id: string;
  date: string;
  time: string;
  title: string;
  description: string;
  location?: string;
  inspector?: string;
}

export interface Container {
  id: string;
  containerId: string;
  type: string;
  size: string;
  status: 'available' | 'loaded' | 'in_repair' | 'in_transit';
  location: string;
  lastVessel?: string;
  currentVessel?: string;
  icon: string;
  iconColor: string;
  history?: HistoryEvent[];
  selected?: boolean;
}

export interface FilterOption {
  id: string;
  label: string;
  active: boolean;
}

@Component({
  selector: 'app-container-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './container-inventory.component.html',
  styleUrls: ['./container-inventory.component.css']
})
export class ContainerInventoryComponent implements OnInit, OnDestroy {
  containers: Container[] = [];
  filteredContainers: Container[] = [];
  selectedContainer: Container | null = null;
  showHistory = false;
  searchQuery = '';
  
  filters: FilterOption[] = [
    { id: 'all', label: 'All Units', active: true },
    { id: 'available', label: 'Available', active: false },
    { id: 'loaded', label: 'Loaded', active: false },
    { id: 'in_repair', label: 'In Repair', active: false }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadMockData();
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  loadMockData(): void {
    this.containers = [
      {
        id: '1',
        containerId: 'MSCU 827364-1',
        type: 'Reefer',
        size: '40ft HC',
        status: 'available',
        location: 'Port of Singapore',
        lastVessel: 'Ever Given II',
        icon: 'ac_unit',
        iconColor: 'text-sky-500',
        selected: true,
        history: [
          {
            id: '1',
            date: 'OCT 24',
            time: '14:20',
            title: 'Gate-In: Port of Singapore',
            description: 'Unloaded from Ever Given II',
            location: 'Port of Singapore'
          },
          {
            id: '2',
            date: 'OCT 20',
            time: '09:15',
            title: 'Vessel Departure',
            description: 'Transit: Hong Kong -> Singapore',
            location: 'Hong Kong Strait'
          },
          {
            id: '3',
            date: 'OCT 18',
            time: '22:45',
            title: 'Load-On: Hong Kong Terminal',
            description: 'Verified by Inspector J. Doe',
            location: 'Hong Kong Terminal',
            inspector: 'J. Doe'
          }
        ]
      },
      {
        id: '2',
        containerId: 'ZIMU 110928-4',
        type: 'Dry Storage',
        size: '20ft',
        status: 'loaded',
        location: 'In Transit',
        currentVessel: 'Maersk Atlantic',
        icon: 'inventory_2',
        iconColor: 'text-orange-400',
        selected: false,
        history: [
          {
            id: '1',
            date: 'OCT 22',
            time: '08:30',
            title: 'Loaded onto Vessel',
            description: 'Secured on Maersk Atlantic',
            location: 'Port of Hamburg'
          },
          {
            id: '2',
            date: 'OCT 21',
            time: '16:45',
            title: 'Customs Clearance',
            description: 'Export documentation approved',
            location: 'Hamburg Customs'
          }
        ]
      },
      {
        id: '3',
        containerId: 'HLXU 556732-2',
        type: 'Tank',
        size: '40ft',
        status: 'in_repair',
        location: 'Singapore Yard',
        icon: 'local_gas_station',
        iconColor: 'text-red-500',
        selected: false,
        history: [
          {
            id: '1',
            date: 'OCT 23',
            time: '10:15',
            title: 'Maintenance Required',
            description: 'Valve repair scheduled',
            location: 'Singapore Yard'
          }
        ]
      },
      {
        id: '4',
        containerId: 'TCLU 884421-9',
        type: 'Flat Rack',
        size: '40ft',
        status: 'available',
        location: 'Port of Rotterdam',
        lastVessel: 'COSCO Pacific',
        icon: 'view_in_ar',
        iconColor: 'text-purple-500',
        selected: false,
        history: [
          {
            id: '1',
            date: 'OCT 20',
            time: '11:30',
            title: 'Available for Loading',
            description: 'Inspection complete',
            location: 'Port of Rotterdam'
          }
        ]
      },
      {
        id: '5',
        containerId: 'MSKU 332198-7',
        type: 'Open Top',
        size: '40ft HC',
        status: 'in_transit',
        location: 'Pacific Ocean',
        currentVessel: 'MSC Mediterranean',
        icon: 'vertical_align_top',
        iconColor: 'text-green-500',
        selected: false,
        history: [
          {
            id: '1',
            date: 'OCT 21',
            time: '14:00',
            title: 'Departed Port',
            description: 'En route to Los Angeles',
            location: 'Pacific Ocean'
          }
        ]
      }
    ];

    this.filteredContainers = [...this.containers];
    this.selectedContainer = this.containers.find(c => c.selected) || null;
    if (this.selectedContainer) {
      this.showHistory = true;
    }
  }

  selectContainer(container: Container): void {
    // Clear previous selection
    this.containers.forEach(c => c.selected = false);
    
    // Set new selection
    container.selected = true;
    this.selectedContainer = container;
    this.showHistory = true;
  }

  applyFilter(filterId: string): void {
    // Update filter states
    this.filters.forEach(f => f.active = f.id === filterId);
    
    // Apply filter to containers
    if (filterId === 'all') {
      this.filteredContainers = [...this.containers];
    } else {
      this.filteredContainers = this.containers.filter(container => container.status === filterId);
    }
  }

  onSearch(): void {
    const query = this.searchQuery.toLowerCase().trim();
    
    if (!query) {
      // Re-apply current filter
      const activeFilter = this.filters.find(f => f.active);
      if (activeFilter) {
        this.applyFilter(activeFilter.id);
      }
      return;
    }

    this.filteredContainers = this.containers.filter(container =>
      container.containerId.toLowerCase().includes(query) ||
      container.type.toLowerCase().includes(query) ||
      container.location.toLowerCase().includes(query) ||
      (container.lastVessel && container.lastVessel.toLowerCase().includes(query)) ||
      (container.currentVessel && container.currentVessel.toLowerCase().includes(query))
    );
  }

  viewHistory(container: Container): void {
    this.selectContainer(container);
    // Scroll to history section
    setTimeout(() => {
      const historyElement = document.getElementById('history-section');
      if (historyElement) {
        historyElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  viewFullLogs(): void {
    // In a real app, this would navigate to detailed logs
    console.log('View full logs for:', this.selectedContainer?.containerId);
  }

  getStatusBadgeClass(status: string): string {
    const baseClass = 'px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tight';
    
    switch (status) {
      case 'available':
        return `${baseClass} bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400`;
      case 'loaded':
        return `${baseClass} bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400`;
      case 'in_repair':
        return `${baseClass} bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400`;
      case 'in_transit':
        return `${baseClass} bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400`;
      default:
        return `${baseClass} bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400`;
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  scanBarcode(): void {
    // In a real app, this would open barcode scanner
    console.log('Scan barcode clicked');
  }

  showNotifications(): void {
    // In a real app, this would show notifications panel
    console.log('Show notifications clicked');
  }

  addContainer(): void {
    // In a real app, this would open add container form
    console.log('Add container clicked');
  }

  showMoreOptions(container: Container): void {
    // In a real app, this would show more options menu
    console.log('More options for:', container.containerId);
  }

  navigateToMap(): void {
    // In a real app, this would navigate to map view
    console.log('Navigate to map view');
  }

  navigateToInsights(): void {
    // In a real app, this would navigate to insights/analytics
    console.log('Navigate to insights');
  }

  navigateToFleet(): void {
    // In a real app, this would navigate to fleet management
    console.log('Navigate to fleet');
  }

  trackByContainerId(index: number, container: Container): string {
    return container.id;
  }

  trackByHistoryId(index: number, event: HistoryEvent): string {
    return event.id;
  }
}
