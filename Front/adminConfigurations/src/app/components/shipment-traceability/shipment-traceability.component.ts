import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

export interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'vessel' | 'customs' | 'port_ops' | 'gate';
  description?: string;
  location?: string;
  officer?: {
    name: string;
    avatar?: string;
  };
  quote?: string;
  isRecent?: boolean;
}

export interface Shipment {
  id: string;
  containerId: string;
  vesselName: string;
  voyage: string;
  imo: string;
  status: 'in_transit' | 'at_port' | 'delayed' | 'delivered';
  progress: number;
  origin: {
    port: string;
    code: string;
  };
  destination: {
    port: string;
    code: string;
  };
  eta: string;
  onSchedule: boolean;
  events: TimelineEvent[];
}

@Component({
  selector: 'app-shipment-traceability',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shipment-traceability.component.html',
  styleUrls: ['./shipment-traceability.component.css']
})
export class ShipmentTraceabilityComponent implements OnInit, OnDestroy {
  shipments: Shipment[] = [];
  currentShipment: Shipment | null = null;
  searchQuery = '';
  showFilterMenu = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadMockData();
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  loadMockData(): void {
    this.shipments = [
      {
        id: '1',
        containerId: 'MSCU1234567',
        vesselName: 'OOCL Hong Kong',
        voyage: '042W',
        imo: '9776107',
        status: 'in_transit',
        progress: 65,
        origin: {
          port: 'Shanghai',
          code: 'CNSHA'
        },
        destination: {
          port: 'Rotterdam',
          code: 'NLRTM'
        },
        eta: 'Oct 24, 2023',
        onSchedule: true,
        events: [
          {
            id: '1',
            title: 'Singapore Strait Transit',
            date: 'Oct 18, 2023',
            time: '09:42 AM',
            type: 'vessel',
            description: 'Passed waypoint Bravo. Weather conditions optimal. Speed maintained at 18.5 knots.',
            location: 'Singapore Strait',
            officer: {
              name: 'Marco Rossi',
              avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAly3HlSB6YHU1PHi0xA_p-PVaB3VznJYE8Z7vMMXsptf3TEoaS8_t79gsyiXnK7IfyjEIfjtffj3HY_GPT8rykKaZaBlrVWg5DT5BwdOysL12QiZtcf_lKxKezXmuCKEI00jjvuuWISRLkUT_BSe82JfjaZwsqNt-4VfAKRo_dqOLi8hUY_RpNLVUFRhs1AbdiW7I2O9IybOMPKzdjuEtqxKy_4qc2mw7KK4yH3H9oZnbMXdNU6w3W1xWlsmWfM6LpMsl6P4kvl-g'
            },
            quote: 'Passed waypoint Bravo. Weather conditions optimal. Speed maintained at 18.5 knots.',
            isRecent: true
          },
          {
            id: '2',
            title: 'Customs Clearance Export',
            date: 'Oct 12, 2023',
            time: '02:15 PM',
            type: 'customs',
            location: 'Hong Kong Customs',
            officer: {
              name: 'Sarah J. Lin',
              avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLnalNhGG0t8njYvrbfhKja0v4lwoUKOSaywnRzI_GndGRFGuRc30l5wYwSTYKjPsLdHw7OJVSIbrQKIakkibyd8e8Za8mr5fsl6z1s7gu7PpzbH-8WjYPNamN9CBhLThySOnMIm4jKxAbCt-mVsSahtwu6WIEdZ4gGf1DUtAMg0q0H0Nx6cAfiHwAhDTVnGt8mUY2oIX8Fq68Fj--a9r73Q7nLsEcYVh-oNWf8fgvbpPSmG1GwGfZ5OJ3BU-0KCyI5wNf3I6N0vc'
            }
          },
          {
            id: '3',
            title: 'Container Loaded',
            date: 'Oct 11, 2023',
            time: '11:30 PM',
            type: 'port_ops',
            location: 'Terminal 4, Port of Shanghai',
            officer: {
              name: 'Chen Wei'
            }
          },
          {
            id: '4',
            title: 'Gate-in Entry',
            date: 'Oct 10, 2023',
            time: '08:00 AM',
            type: 'gate',
            location: 'Port of Shanghai',
            officer: {
              name: 'Zhang Min'
            }
          }
        ]
      },
      {
        id: '2',
        containerId: 'TCLU8765432',
        vesselName: 'Maersk Atlantic',
        voyage: '789E',
        imo: '9785623',
        status: 'at_port',
        progress: 25,
        origin: {
          port: 'Los Angeles',
          code: 'USLAX'
        },
        destination: {
          port: 'Hamburg',
          code: 'DEHAM'
        },
        eta: 'Nov 15, 2023',
        onSchedule: false,
        events: [
          {
            id: '1',
            title: 'Port Arrival',
            date: 'Oct 22, 2023',
            time: '06:30 AM',
            type: 'vessel',
            location: 'Port of Los Angeles',
            officer: {
              name: 'Captain Johnson'
            },
            isRecent: true
          },
          {
            id: '2',
            title: 'Departed Previous Port',
            date: 'Oct 20, 2023',
            time: '11:00 PM',
            type: 'port_ops',
            location: 'Port of Oakland',
            officer: {
              name: 'Port Authority'
            }
          }
        ]
      }
    ];

    // Set current shipment to first one by default
    this.currentShipment = this.shipments[0];
    this.searchQuery = this.currentShipment.containerId;
  }

  searchShipment(): void {
    const query = this.searchQuery.toLowerCase().trim();
    
    if (!query) {
      this.currentShipment = null;
      return;
    }

    const found = this.shipments.find(shipment => 
      shipment.containerId.toLowerCase().includes(query) ||
      shipment.vesselName.toLowerCase().includes(query)
    );

    this.currentShipment = found || null;
  }

  getEventTypeColor(type: string): string {
    switch (type) {
      case 'vessel':
        return 'bg-blue-50 text-blue-600';
      case 'customs':
        return 'bg-green-50 text-green-600';
      case 'port_ops':
        return 'bg-gray-100 text-gray-600';
      case 'gate':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  }

  getEventIconColor(type: string, isRecent?: boolean): string {
    if (isRecent) {
      return 'bg-primary';
    }
    
    switch (type) {
      case 'vessel':
        return 'bg-primary';
      case 'customs':
        return 'bg-green-500';
      case 'port_ops':
      case 'gate':
        return 'bg-gray-300';
      default:
        return 'bg-gray-300';
    }
  }

  getEventIcon(type: string): string {
    switch (type) {
      case 'vessel':
        return 'location_on';
      case 'customs':
        return 'verified_user';
      case 'port_ops':
        return 'view_in_ar';
      case 'gate':
        return 'login';
      default:
        return 'info';
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'in_transit':
        return 'text-primary font-bold text-sm uppercase tracking-wider';
      case 'at_port':
        return 'text-blue-600 font-bold text-sm uppercase tracking-wider';
      case 'delayed':
        return 'text-red-600 font-bold text-sm uppercase tracking-wider';
      case 'delivered':
        return 'text-green-600 font-bold text-sm uppercase tracking-wider';
      default:
        return 'text-gray-600 font-bold text-sm uppercase tracking-wider';
    }
  }

  getScheduleBadgeClass(onSchedule: boolean): string {
    return onSchedule 
      ? 'bg-primary text-white text-xs px-2 py-1 rounded-full font-medium'
      : 'bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium';
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  showMoreOptions(): void {
    // In a real app, this would show more options menu
    console.log('Show more options');
  }

  toggleFilterMenu(): void {
    this.showFilterMenu = !this.showFilterMenu;
  }

  shareShipment(): void {
    // In a real app, this would share shipment details
    console.log('Share shipment:', this.currentShipment?.containerId);
  }

  navigateToVessels(): void {
    // In a real app, this would navigate to vessels page
    console.log('Navigate to vessels');
  }

  navigateToFleet(): void {
    // In a real app, this would navigate to fleet page
    console.log('Navigate to fleet');
  }

  navigateToProfile(): void {
    // In a real app, this would navigate to profile page
    console.log('Navigate to profile');
  }

  scanBarcode(): void {
    // In a real app, this would open barcode scanner
    console.log('Scan barcode');
  }

  trackByEventId(index: number, event: TimelineEvent): string {
    return event.id;
  }
}
