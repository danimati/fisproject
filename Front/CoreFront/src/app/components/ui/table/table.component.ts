import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn<T> {
  key: keyof T;
  title: string;
  sortable?: boolean;
  render?: (value: any, record: T) => string;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <!-- Header -->
        <thead class="bg-gray-50">
          <tr>
            <th *ngFor="let column of columns" 
                [class]="getHeaderClass(column)"
                [style.width]="column.width">
              <button *ngIf="column.sortable" 
                      (click)="handleSort(column.key)"
                      class="flex items-center space-x-1 hover:text-gray-700">
                <span>{{ column.title }}</span>
                <svg *ngIf="sortKey === column.key" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path *ngIf="sortDirection === 'asc'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                  <path *ngIf="sortDirection === 'desc'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <span *ngIf="!column.sortable">{{ column.title }}</span>
            </th>
          </tr>
        </thead>

        <!-- Loading State -->
        <tbody *ngIf="loading">
          <tr>
            <td [attr.colspan]="columns.length" class="px-6 py-8 text-center">
              <div class="flex justify-center">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            </td>
          </tr>
        </tbody>

        <!-- Empty State -->
        <tbody *ngIf="!loading && data.length === 0">
          <tr>
            <td [attr.colspan]="columns.length" class="px-6 py-8 text-center text-gray-500">
              {{ emptyMessage }}
            </td>
          </tr>
        </tbody>

        <!-- Data Rows -->
        <tbody *ngIf="!loading && data.length > 0" class="bg-white divide-y divide-gray-200">
          <tr *ngFor="let record of data; trackBy: trackByFn"
              [class]="onRowClick ? 'hover:bg-gray-50 cursor-pointer' : ''"
              (click)="onRowClick ? onRowClick(record) : null">
            <td *ngFor="let column of columns" 
                [class]="getCellClass(column)">
              <ng-container *ngIf="column.render; else defaultContent">
                <span [innerHTML]="column.render(record[column.key], record)"></span>
              </ng-container>
              <ng-template #defaultContent>
                {{ record[column.key] }}
              </ng-template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class TableComponent<T> {
  @Input() data: T[] = [];
  @Input() columns: TableColumn<T>[] = [];
  @Input() loading = false;
  @Input() emptyMessage = 'No data available';
  @Input() sortKey?: keyof T;
  @Input() sortDirection?: 'asc' | 'desc';
  @Input() onRowClick?: (record: T) => void;

  @Output() sort = new EventEmitter<{ key: keyof T; direction: 'asc' | 'desc' }>();

  trackByFn(index: number, item: T): any {
    return item;
  }

  getHeaderClass(column: TableColumn<T>): string {
    const classes = ['px-6', 'py-3', 'text-left', 'text-xs', 'font-medium', 'uppercase', 'tracking-wider', 'text-gray-500'];
    
    if (column.align === 'center') {
      classes.push('text-center');
    } else if (column.align === 'right') {
      classes.push('text-right');
    }
    
    return classes.join(' ');
  }

  getCellClass(column: TableColumn<T>): string {
    const classes = ['px-6', 'py-4', 'whitespace-nowrap', 'text-sm', 'text-gray-900'];
    
    if (column.align === 'center') {
      classes.push('text-center');
    } else if (column.align === 'right') {
      classes.push('text-right');
    }
    
    return classes.join(' ');
  }

  handleSort(key: keyof T) {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (this.sortKey === key && this.sortDirection === 'asc') {
      direction = 'desc';
    }
    
    this.sort.emit({ key, direction });
  }
}
