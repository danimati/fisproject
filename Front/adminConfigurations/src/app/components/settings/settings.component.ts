import { Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  standalone: true,
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600">Application settings and configurations will be displayed here.</p>
      </div>
    </div>
  `
})
export class SettingsComponent {}
