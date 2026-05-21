import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { GatewayService, AdminStats, PerformanceMetrics } from '../../services/gateway.service';
import { Subscription } from 'rxjs';

type HealthState = 'checking' | 'healthy' | 'degraded' | 'unhealthy' | 'error';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  stats: AdminStats | null = null;
  performanceMetrics: PerformanceMetrics | null = null;
  loading = true;
  error = '';
  healthLoading = true;
  gatewayHealth: HealthState = 'checking';
  backendHealth: HealthState = 'checking';
  redisHealth: HealthState = 'checking';
  gatewayHealthMessage = 'Consultando estado del gateway...';
  backendHealthMessage = 'Consultando estado del backend...';
  redisHealthMessage = 'Consultando estado de Redis...';
  
  private refreshInterval: any;
  private subscriptions: Subscription[] = [];

  constructor(
    public authService: AuthService,
    private gatewayService: GatewayService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.setupAutoRefresh();
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadDashboardData(): void {
    this.loading = true;
    this.error = '';
    this.healthLoading = true;
    this.gatewayHealth = 'checking';
    this.backendHealth = 'checking';
    this.redisHealth = 'checking';
    this.gatewayHealthMessage = 'Consultando estado del gateway...';
    this.backendHealthMessage = 'Consultando estado del backend...';
    this.redisHealthMessage = 'Consultando estado de Redis...';

    const healthSub = this.gatewayService.getHealthCheck().subscribe({
      next: (health) => {
        setTimeout(() => {
          this.gatewayHealth = (health?.status ?? 'healthy') as HealthState;
          this.gatewayHealthMessage = health?.service ? `Servicio: ${health.service}` : 'Gateway operativo';
          this.healthLoading = false;
          this.cdr.detectChanges();
        }, 0);
      },
      error: (err) => {
        console.error('❌ Gateway health error:', err);
        setTimeout(() => {
          this.gatewayHealth = 'error';
          this.gatewayHealthMessage = 'No fue posible consultar el estado del gateway.';
          this.healthLoading = false;
          this.cdr.detectChanges();
        }, 0);
      }
    });

    const backendHealthSub = this.gatewayService.getBackendHealth().subscribe({
      next: (health) => {
        setTimeout(() => {
          this.backendHealth = (health?.status ?? 'healthy') as HealthState;
          this.backendHealthMessage = health?.gateway ? `Gateway: ${health.gateway}` : 'Estado del sistema consultado';
          this.redisHealth = health?.backend === 'healthy' ? 'healthy' : 'unhealthy';
          this.redisHealthMessage = health?.backend ? `Backend: ${health.backend}` : 'Sin detalle del backend';
          this.healthLoading = false;
          this.cdr.detectChanges();
        }, 0);
      },
      error: (err) => {
        console.error('❌ Backend health error:', err);
        setTimeout(() => {
          this.backendHealth = 'error';
          this.backendHealthMessage = 'No fue posible consultar el estado del backend.';
          this.healthLoading = false;
          this.cdr.detectChanges();
        }, 0);
      }
    });

    this.subscriptions.push(healthSub, backendHealthSub);
    
    let statsLoaded = false;
    let metricsLoaded = false;

    const statsSub = this.gatewayService.getAdminStats().subscribe({
      next: (stats) => {
        // Use setTimeout to ensure change detection happens in next tick
        setTimeout(() => {
          this.stats = stats;
          statsLoaded = true;
          if (metricsLoaded) {
            this.loading = false;
            // Force change detection to ensure UI updates
            this.cdr.detectChanges();
          }
        }, 0);
      },
      error: (err) => {
        console.error('❌ Stats error:', err);
        setTimeout(() => {
          this.error = 'Failed to load dashboard statistics';
          this.loading = false;
          // Force change detection to ensure UI updates
          this.cdr.detectChanges();
        }, 0);
      }
    });

    const performanceSub = this.gatewayService.getPerformanceMetrics().subscribe({
      next: (metrics) => {
        // Use setTimeout to ensure change detection happens in next tick
        setTimeout(() => {
          this.performanceMetrics = metrics;
          metricsLoaded = true;
          if (statsLoaded) {
            this.loading = false;
            // Force change detection to ensure UI updates
            this.cdr.detectChanges();
          }
        }, 0);
      },
      error: (err) => {
        console.error('❌ Performance metrics error:', err);
        setTimeout(() => {
          if (!statsLoaded) {
            this.loading = false;
            // Force change detection to ensure UI updates
            this.cdr.detectChanges();
          }
        }, 0);
      }
    });

    this.subscriptions.push(statsSub, performanceSub);
  }

  // Public method for refresh button
  refreshDashboard(): void {
    this.loadDashboardData();
  }

  private setupAutoRefresh(): void {
    // Refresh data every 30 seconds
    this.refreshInterval = setInterval(() => {
      this.loadDashboardData();
    }, 30000);
  }

  formatDate(dateString: string): string {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString();
  }

  getResponseTimeColor(avgTime: number): string {
    if (avgTime < 100) return 'text-green-600';
    if (avgTime < 500) return 'text-yellow-600';
    return 'text-red-600';
  }

  getStatusPercentage(count: number): number {
    if (!this.performanceMetrics?.status_distribution) return 0;
    const total = this.performanceMetrics.status_distribution.reduce((sum, item) => sum + item.count, 0);
    return total > 0 ? (count / total) * 100 : 0;
  }

  getEndpointPercentage(count: number): number {
    if (!this.performanceMetrics?.top_endpoints) return 0;
    const maxCount = Math.max(...this.performanceMetrics.top_endpoints.map(item => item.count));
    return maxCount > 0 ? (count / maxCount) * 100 : 0;
  }

  // Helper method for safe access to status distribution
  getStatusDistribution(): any[] {
    return this.performanceMetrics?.status_distribution || [];
  }

  // Helper method for safe access to Math in template
  getMath(): typeof Math {
    return Math;
  }

  navigateToBranchAccess(): void {
    this.router.navigate(['/branch-access']);
  }

  navigateToClientDirectory(): void {
    this.router.navigate(['/client-directory']);
  }

  navigateToContainerInventory(): void {
    this.router.navigate(['/container-inventory']);
  }

  navigateToShipmentTraceability(): void {
    this.router.navigate(['/shipment-traceability']);
  }

  navigateToMaritimeDashboard(): void {
    this.router.navigate(['/maritime-dashboard']);
  }

  navigateToVesselFleet(): void {
    this.router.navigate(['/vessel-fleet']);
  }

  getHealthBadgeClass(state: HealthState): string {
    switch (state) {
      case 'healthy':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'degraded':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'unhealthy':
      case 'error':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  }
}
