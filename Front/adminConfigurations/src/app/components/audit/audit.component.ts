import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GatewayService, AuditLog } from '../../services/gateway.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-audit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.css']
})
export class AuditComponent implements OnInit {
  auditLogs: AuditLog[] = [];
  filteredLogs: AuditLog[] = [];
  loading = true;
  error = '';
  
  // Modal states
  selectedLog: AuditLog | null = null;
  showLogModal = false;
  
  // Filters
  searchQuery = '';
  eventTypeFilter = '';
  statusCodeFilter = '';
  limit = 50;
  offset = 0;
  hasMore = false;

  private subscriptions: Subscription[] = [];

  constructor(private gatewayService: GatewayService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadAuditLogs();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadAuditLogs(): void {
    this.loading = true;
    this.error = '';

    const sub = this.gatewayService.getAuditLogs({
      limit: this.limit,
      offset: this.offset
    }).subscribe({
      next: (logs) => {
        // Use setTimeout to ensure change detection happens in next tick
        setTimeout(() => {
          if (this.offset === 0) {
            this.auditLogs = logs;
          } else {
            this.auditLogs = [...this.auditLogs, ...logs];
          }
          this.hasMore = logs.length === this.limit;
          this.applyFilters();
          // Set loading to false immediately after data processing
          this.loading = false;
        }, 0);
      },
      error: (err) => {
        console.error('Error loading audit logs:', err);
        // Use setTimeout to ensure change detection happens in next tick
        setTimeout(() => {
          this.error = 'Failed to load audit logs';
          this.loading = false;
        }, 0);
      }
    });

    this.subscriptions.push(sub);
  }

  loadMore(): void {
    if (!this.loading && this.hasMore) {
      this.offset += this.limit;
      this.loadAuditLogs();
    }
  }

  applyFilters(): void {
    this.filteredLogs = this.auditLogs;

    if (this.searchQuery) {
      this.filteredLogs = this.filteredLogs.filter(log =>
        log.endpoint.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        log.method.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        log.ip_address.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    if (this.eventTypeFilter) {
      this.filteredLogs = this.filteredLogs.filter(log => log.event_type === this.eventTypeFilter);
    }

    if (this.statusCodeFilter) {
      this.filteredLogs = this.filteredLogs.filter(log => {
        const status = log.status_code.toString();
        switch (this.statusCodeFilter) {
          case 'success': return log.status_code >= 200 && log.status_code < 300;
          case 'client_error': return log.status_code >= 400 && log.status_code < 500;
          case 'server_error': return log.status_code >= 500;
          default: return true;
        }
      });
    }
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  refreshLogs(): void {
    this.offset = 0;
    this.loadAuditLogs();
  }

  openLogModal(log: AuditLog): void {
    console.log('Opening modal for log:', log); // Debug log
    this.selectedLog = log;
    this.showLogModal = true;
    console.log('Modal state:', { showLogModal: this.showLogModal, selectedLog: this.selectedLog }); // Debug state
  }

  closeLogModal(): void {
    this.showLogModal = false;
    this.selectedLog = null;
  }

  // Helper methods for display
  getStatusColor(statusCode: number): string {
    if (statusCode >= 200 && statusCode < 300) return 'bg-green-500';
    if (statusCode >= 400 && statusCode < 500) return 'bg-yellow-500';
    if (statusCode >= 500) return 'bg-red-500';
    return 'bg-gray-500';
  }

  getStatusTextColor(statusCode: number): string {
    if (statusCode >= 200 && statusCode < 300) return 'text-green-600';
    if (statusCode >= 400 && statusCode < 500) return 'text-yellow-600';
    if (statusCode >= 500) return 'text-red-600';
    return 'text-gray-600';
  }

  formatDate(dateString: string): string {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString();
  }

  formatResponseTime(time: number): string {
    return `${time.toFixed(2)}ms`;
  }

  formatJson(obj: any): string {
    return JSON.stringify(obj, null, 2);
  }

  getEventTypes(): string[] {
    const types = [...new Set(this.auditLogs.map(log => log.event_type))];
    return types.filter(Boolean).sort();
  }

  trackByLogId(index: number, log: AuditLog): string {
    return log.id;
  }
}
