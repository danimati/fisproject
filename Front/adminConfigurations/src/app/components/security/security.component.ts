import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GatewayService, BlockedIP } from '../../services/gateway.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-security',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.css']
})
export class SecurityComponent implements OnInit, OnDestroy {
  blockedIPs: BlockedIP[] = [];
  loading = true;
  error = '';
  unblockingIPs: Set<string> = new Set();
  
  private subscriptions: Subscription[] = [];

  constructor(private gatewayService: GatewayService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadBlockedIPs();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadBlockedIPs(): void {
    this.loading = true;
    this.error = '';

    const sub = this.gatewayService.getBlockedIPs().subscribe({
      next: (blockedIPs) => {
        setTimeout(() => {
          this.blockedIPs = blockedIPs;
          this.loading = false;
          this.cdr.detectChanges();
        }, 0);
      },
      error: (err) => {
        setTimeout(() => {
          this.error = 'Failed to load blocked IPs';
          this.loading = false;
          this.cdr.detectChanges();
        }, 0);
      }
    });

    this.subscriptions.push(sub);
  }

  unblockIP(ipAddress: string): void {
    if (this.unblockingIPs.has(ipAddress)) {
      return; // Prevent double unblocking
    }

    this.unblockingIPs.add(ipAddress);

    const sub = this.gatewayService.unblockIP(ipAddress).subscribe({
      next: () => {
        this.unblockingIPs.delete(ipAddress);
        this.loadBlockedIPs(); // Refresh the list
      },
      error: (err) => {
        this.unblockingIPs.delete(ipAddress);
        this.error = 'Failed to unblock IP';
        this.cdr.detectChanges();
      }
    });

    this.subscriptions.push(sub);
  }

  formatDate(dateString: string): string {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString();
  }

  isUnblocking(ipAddress: string): boolean {
    return this.unblockingIPs.has(ipAddress);
  }
}
