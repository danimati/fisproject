import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

export interface KPIMetric {
  id: string;
  title: string;
  value: string;
  icon: string;
  trend: {
    value: string;
    type: 'positive' | 'negative' | 'neutral';
  };
}

export interface Movement {
  id: string;
  shipmentId: string;
  route: string;
  status: 'in_transit' | 'delivered' | 'delayed';
  icon: string;
  iconColor: string;
}

export interface VesselMarker {
  id: string;
  name: string;
  location: string;
  status: 'active' | 'alert' | 'normal';
  position: {
    top: string;
    left: string;
  };
  color: string;
}

export interface DashboardData {
  branchName: string;
  userRole: string;
  isOnline: boolean;
  kpis: KPIMetric[];
  currentHighlight: {
    vessel: string;
    location: string;
    status: string;
  };
  movements: Movement[];
  vesselMarkers: VesselMarker[];
}

@Component({
  selector: 'app-maritime-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './maritime-dashboard.component.html',
  styleUrls: ['./maritime-dashboard.component.css']
})
export class MaritimeDashboardComponent implements OnInit, OnDestroy {
  dashboardData: DashboardData | null = null;
  loading = true;
  error = '';

  constructor(private router: Router) {}

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

      this.dashboardData = {
        branchName: 'Main Branch',
        userRole: 'Admin Role',
        isOnline: true,
        kpis: [
          {
            id: '1',
            title: 'Active Containers',
            value: '1,248',
            icon: 'box',
            trend: {
              value: '+2.5%',
              type: 'positive'
            }
          },
          {
            id: '2',
            title: 'In Transit',
            value: '856',
            icon: 'local_shipping',
            trend: {
              value: '-1.2%',
              type: 'negative'
            }
          },
          {
            id: '3',
            title: 'Incidents',
            value: '12',
            icon: 'report_problem',
            trend: {
              value: '0%',
              type: 'neutral'
            }
          },
          {
            id: '4',
            title: 'Pending Audits',
            value: '24',
            icon: 'fact_check',
            trend: {
              value: '+5%',
              type: 'positive'
            }
          }
        ],
        currentHighlight: {
          vessel: 'Ever Fortune',
          location: 'North Sea',
          status: 'Active'
        },
        movements: [
          {
            id: '1',
            shipmentId: 'SHP-92831',
            route: 'Singapore â Rotterdam',
            status: 'in_transit',
            icon: 'directions_boat',
            iconColor: 'text-primary'
          },
          {
            id: '2',
            shipmentId: 'SHP-11029',
            route: 'Dubai â Hamburg',
            status: 'delivered',
            icon: 'inventory_2',
            iconColor: 'text-slate-400'
          },
          {
            id: '3',
            shipmentId: 'SHP-77261',
            route: 'Shanghai â LA Port',
            status: 'delayed',
            icon: 'schedule',
            iconColor: 'text-red-400'
          }
        ],
        vesselMarkers: [
          {
            id: '1',
            name: 'Ever Fortune',
            location: 'North Sea',
            status: 'active',
            position: {
              top: '50%',
              left: '33.33%'
            },
            color: 'bg-primary'
          },
          {
            id: '2',
            name: 'Atlantic Pearl',
            location: 'South Atlantic',
            status: 'alert',
            position: {
              top: '25%',
              left: '66.67%'
            },
            color: 'bg-red-500'
          },
          {
            id: '3',
            name: 'Pacific Voyager',
            location: 'Pacific Ocean',
            status: 'normal',
            position: {
              top: '75%',
              left: '75%'
            },
            color: 'bg-green-500'
          }
        ]
      };
    } catch (error) {
      this.error = 'Failed to load dashboard data. Please try again.';
      console.error('Error loading mock data:', error);
    } finally {
      this.loading = false;
    }
  }

  getTrendClass(trendType: string): string {
    switch (trendType) {
      case 'positive':
        return 'text-green-600 bg-green-50';
      case 'negative':
        return 'text-red-500 bg-red-50';
      case 'neutral':
        return 'text-slate-400 bg-slate-50';
      default:
        return 'text-slate-400 bg-slate-50';
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'in_transit':
        return 'bg-blue-50 text-blue-600';
      case 'delivered':
        return 'bg-green-50 text-green-600';
      case 'delayed':
        return 'bg-red-50 text-red-600';
      case 'active':
        return 'bg-primary text-white';
      default:
        return 'bg-slate-50 text-slate-600';
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  showNotifications(): void {
    // In a real app, this would show notifications panel
    console.log('Show notifications');
  }

  viewMap(): void {
    // In a real app, this would navigate to map view
    console.log('View map');
  }

  navigateToVessels(): void {
    // In a real app, this would navigate to vessels page
    console.log('Navigate to vessels');
  }

  navigateToShipments(): void {
    // In a real app, this would navigate to shipments page
    console.log('Navigate to shipments');
  }

  navigateToReports(): void {
    // In a real app, this would navigate to reports page
    console.log('Navigate to reports');
  }

  navigateToSettings(): void {
    // In a real app, this would navigate to settings page
    console.log('Navigate to settings');
  }

  trackByKpiId(index: number, kpi: KPIMetric): string {
    return kpi.id;
  }

  trackByMovementId(index: number, movement: Movement): string {
    return movement.id;
  }

  trackByMarkerId(index: number, marker: VesselMarker): string {
    return marker.id;
  }
}
