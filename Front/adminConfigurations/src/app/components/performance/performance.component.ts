import { Component } from '@angular/core';

@Component({
  selector: 'app-performance',
  standalone: true,
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Performance</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600">Performance metrics and monitoring will be displayed here.</p>
      </div>
    </div>
  `
})
export class PerformanceComponent {}
