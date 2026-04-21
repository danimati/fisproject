import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

export interface Shipment {
  id: string;
  vessel: string;
  eta: string;
}

export interface Client {
  id: string;
  name: string;
  clientId: string;
  type: 'corporate' | 'individual';
  status: 'active' | 'inactive';
  location: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  creditLimit: number;
  creditUtilization: number;
  creditClass: 'A' | 'B' | 'C';
  icon: string;
  selected?: boolean;
  shipments?: Shipment[];
}

export interface FilterOption {
  id: string;
  label: string;
  active: boolean;
}

@Component({
  selector: 'app-client-directory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client-directory.component.html',
  styleUrls: ['./client-directory.component.css']
})
export class ClientDirectoryComponent implements OnInit, OnDestroy {
  clients: Client[] = [];
  filteredClients: Client[] = [];
  selectedClient: Client | null = null;
  showDetailPanel = false;
  searchQuery = '';
  
  filters: FilterOption[] = [
    { id: 'all', label: 'All Clients', active: true },
    { id: 'corporate', label: 'Corporate', active: false },
    { id: 'individual', label: 'Individual', active: false },
    { id: 'international', label: 'International', active: false }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadMockData();
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  loadMockData(): void {
    this.clients = [
      {
        id: '1',
        name: 'Global Marine Logistics',
        clientId: 'GML-99283',
        type: 'corporate',
        status: 'active',
        location: 'Rotterdam, NL',
        description: 'Primary Freight Partner',
        email: 'ops@globalmarine.nl',
        phone: '+31 10 440 2291',
        address: 'Willemswerf, Boompjes 40, 3011 XB Rotterdam, Netherlands',
        creditLimit: 750000,
        creditUtilization: 502400,
        creditClass: 'A',
        icon: 'corporate_fare',
        selected: true,
        shipments: [
          { id: 'SH-992-X1', vessel: 'Ever Given', eta: '14 Oct' },
          { id: 'SH-884-Y2', vessel: 'Maersk Atlantic', eta: '18 Oct' }
        ]
      },
      {
        id: '2',
        name: 'North Star Shipping',
        clientId: 'NSS-44102',
        type: 'corporate',
        status: 'active',
        location: 'Hamburg, DE',
        description: 'Regional Shipping Partner',
        email: 'info@northstar.de',
        phone: '+49 40 123 4567',
        address: 'Hafenstraße 123, 20457 Hamburg, Germany',
        creditLimit: 500000,
        creditUtilization: 250000,
        creditClass: 'B',
        icon: 'apartment',
        selected: false,
        shipments: [
          { id: 'SH-773-Z3', vessel: 'Northern Star', eta: '22 Oct' }
        ]
      },
      {
        id: '3',
        name: 'Capt. Elena Moretti',
        clientId: 'IND-11209',
        type: 'individual',
        status: 'active',
        location: 'Genoa, IT',
        description: 'Independent Cargo Broker',
        email: 'elena@moretti.it',
        phone: '+39 010 123 456',
        address: 'Via Garibaldi 15, 16124 Genoa, Italy',
        creditLimit: 100000,
        creditUtilization: 45000,
        creditClass: 'B',
        icon: 'person',
        selected: false,
        shipments: []
      },
      {
        id: '4',
        name: 'Pacific Rim Exports',
        clientId: 'PRE-88331',
        type: 'corporate',
        status: 'active',
        location: 'Singapore, SG',
        description: 'Asia-Pacific Logistics',
        email: 'contact@pacificrim.sg',
        phone: '+65 6234 5678',
        address: '1 Maritime Square, Singapore 099253',
        creditLimit: 1200000,
        creditUtilization: 890000,
        creditClass: 'A',
        icon: 'business',
        selected: false,
        shipments: [
          { id: 'SH-555-W4', vessel: 'Pacific Dream', eta: '25 Oct' },
          { id: 'SH-666-Q5', vessel: 'Asia Express', eta: '28 Oct' }
        ]
      },
      {
        id: '5',
        name: 'Atlas Freight Co.',
        clientId: 'ATL-22450',
        type: 'corporate',
        status: 'inactive',
        location: 'Dubai, AE',
        description: 'Middle East Freight Forwarder',
        email: 'operations@atlas.ae',
        phone: '+971 4 123 4567',
        address: 'Dubai Trade Center, Dubai, UAE',
        creditLimit: 300000,
        creditUtilization: 150000,
        creditClass: 'C',
        icon: 'apartment',
        selected: false,
        shipments: []
      }
    ];

    this.filteredClients = [...this.clients];
    this.selectedClient = this.clients.find(c => c.selected) || null;
    if (this.selectedClient) {
      this.showDetailPanel = true;
    }
  }

  selectClient(client: Client): void {
    // Clear previous selection
    this.clients.forEach(c => c.selected = false);
    
    // Set new selection
    client.selected = true;
    this.selectedClient = client;
    this.showDetailPanel = true;
  }

  closeDetailPanel(): void {
    this.showDetailPanel = false;
    this.clients.forEach(c => c.selected = false);
    this.selectedClient = null;
  }

  applyFilter(filterId: string): void {
    // Update filter states
    this.filters.forEach(f => f.active = f.id === filterId);
    
    // Apply filter to clients
    if (filterId === 'all') {
      this.filteredClients = [...this.clients];
    } else {
      this.filteredClients = this.clients.filter(client => {
        switch (filterId) {
          case 'corporate':
            return client.type === 'corporate';
          case 'individual':
            return client.type === 'individual';
          case 'international':
            return client.location.includes('NL') || client.location.includes('DE') || 
                   client.location.includes('SG') || client.location.includes('AE');
          default:
            return true;
        }
      });
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

    this.filteredClients = this.clients.filter(client =>
      client.name.toLowerCase().includes(query) ||
      client.clientId.toLowerCase().includes(query) ||
      client.location.toLowerCase().includes(query)
    );
  }

  getCreditUtilizationPercentage(client: Client): number {
    return client.creditLimit > 0 ? (client.creditUtilization / client.creditLimit) * 100 : 0;
  }

  getCreditClassColor(creditClass: string): string {
    switch (creditClass) {
      case 'A':
        return 'bg-primary/20 text-primary border border-primary/30';
      case 'B':
        return 'bg-yellow-100 text-yellow-700 border border-yellow-300';
      case 'C':
        return 'bg-red-100 text-red-700 border border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-300';
    }
  }

  getStatusBadgeClass(status: string): string {
    const baseClass = 'px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider';
    
    switch (status) {
      case 'active':
        return `${baseClass} bg-green-100 text-green-700`;
      case 'inactive':
        return `${baseClass} bg-gray-100 text-gray-700`;
      default:
        return `${baseClass} bg-gray-100 text-gray-700`;
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  addNewClient(): void {
    // In a real app, this would open a modal or navigate to a form
    console.log('Add new client clicked');
  }

  editClient(): void {
    // In a real app, this would open an edit form
    console.log('Edit client:', this.selectedClient?.name);
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Copied to clipboard:', text);
    });
  }

  callPhone(phone: string): void {
    // In a real app, this might open a phone dialer
    console.log('Call phone:', phone);
  }

  viewAllShipments(): void {
    // In a real app, this would navigate to shipments page
    console.log('View all shipments for:', this.selectedClient?.name);
  }

  openShipment(shipment: Shipment): void {
    // In a real app, this would navigate to shipment details
    console.log('Open shipment:', shipment.id);
  }

  trackByClientId(index: number, client: Client): string {
    return client.id;
  }

  trackByShipmentId(index: number, shipment: Shipment): string {
    return shipment.id;
  }
}
