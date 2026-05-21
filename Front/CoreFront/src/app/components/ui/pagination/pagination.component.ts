import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface PaginationOptions {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
}

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
      <div class="flex items-center justify-between w-full">
        <!-- Item count and page size -->
        <div class="flex items-center space-x-4">
          <div class="text-sm text-gray-700">
            Showing <span class="font-medium">{{ startItem }}</span> to 
            <span class="font-medium">{{ endItem }}</span> of 
            <span class="font-medium">{{ options.totalItems }}</span> results
          </div>
          
          <div class="flex items-center space-x-2">
            <label class="text-sm text-gray-700">Per page:</label>
            <select 
              [value]="options.pageSize" 
              (change)="onPageSizeChange($event)"
              class="rounded-md border-gray-300 py-1 pl-2 pr-8 text-sm focus:border-primary-500 focus:ring-primary-500">
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>

        <!-- Page navigation -->
        <div class="flex items-center space-x-1">
          <!-- Previous button -->
          <button 
            [disabled]="options.currentPage === 1"
            (click)="goToPage(options.currentPage - 1)"
            class="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <!-- First page -->
          <ng-container *ngIf="startPage > 1">
            <button 
              (click)="goToPage(1)"
              class="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50">
              1
            </button>
            <span *ngIf="startPage > 2" class="px-2 py-2 text-gray-500">...</span>
          </ng-container>
          
          <!-- Page numbers -->
          <button 
            *ngFor="let page of pageNumbers"
            (click)="goToPage(page)"
            [class]="getPageClass(page)">
            {{ page }}
          </button>
          
          <!-- Last page -->
          <ng-container *ngIf="endPage < options.totalPages">
            <span *ngIf="endPage < options.totalPages - 1" class="px-2 py-2 text-gray-500">...</span>
            <button 
              (click)="goToPage(options.totalPages)"
              class="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50">
              {{ options.totalPages }}
            </button>
          </ng-container>
          
          <!-- Next button -->
          <button 
            [disabled]="options.currentPage === options.totalPages"
            (click)="goToPage(options.currentPage + 1)"
            class="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    
    .page-active {
      background-color: #dbeafe !important;
      color: #1d4ed8 !important;
      border-color: #3b82f6 !important;
      z-index: 10;
    }
  `]
})
export class PaginationComponent {
  @Input() options: PaginationOptions = {
    currentPage: 1,
    totalPages: 1,
    pageSize: 20,
    totalItems: 0
  };

  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  pageNumbers: number[] = [];
  startPage = 1;
  endPage = 1;
  startItem = 1;
  endItem = 1;

  ngOnInit() {
    this.calculatePagination();
  }

  ngOnChanges() {
    this.calculatePagination();
  }

  calculatePagination() {
    const maxVisiblePages = 5;
    
    // Calculate item range
    this.startItem = (this.options.currentPage - 1) * this.options.pageSize + 1;
    this.endItem = Math.min(this.options.currentPage * this.options.pageSize, this.options.totalItems);
    
    // Calculate page range
    this.startPage = Math.max(1, this.options.currentPage - Math.floor(maxVisiblePages / 2));
    this.endPage = Math.min(this.options.totalPages, this.startPage + maxVisiblePages - 1);
    
    if (this.endPage - this.startPage + 1 < maxVisiblePages) {
      this.startPage = Math.max(1, this.endPage - maxVisiblePages + 1);
    }
    
    // Generate page numbers
    this.pageNumbers = [];
    for (let i = this.startPage; i <= this.endPage; i++) {
      this.pageNumbers.push(i);
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.options.totalPages) {
      this.pageChange.emit(page);
    }
  }

  onPageSizeChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.pageSizeChange.emit(Number(target.value));
  }

  getPageClass(page: number): string {
    const baseClass = 'relative inline-flex items-center px-3 py-2 text-sm font-medium border';
    
    if (page === this.options.currentPage) {
      return `${baseClass} page-active`;
    }
    
    return `${baseClass} text-gray-700 bg-white border-gray-300 hover:bg-gray-50`;
  }
}
