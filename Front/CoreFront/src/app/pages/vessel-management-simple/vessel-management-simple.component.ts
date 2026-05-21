import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vessel-management-simple',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50 p-8">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-3xl font-bold text-gray-900 mb-8">Gestión de Buques</h1>
        
        <!-- Simple Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="bg-white p-6 rounded-lg shadow">
            <h3 class="text-lg font-semibold text-gray-900">Total Buques</h3>
            <p class="text-2xl font-bold text-blue-600">5</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow">
            <h3 class="text-lg font-semibold text-gray-900">Activos</h3>
            <p class="text-2xl font-bold text-green-600">3</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow">
            <h3 class="text-lg font-semibold text-gray-900">En Mantenimiento</h3>
            <p class="text-2xl font-bold text-yellow-600">1</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow">
            <h3 class="text-lg font-semibold text-gray-900">En Tránsito</h3>
            <p class="text-2xl font-bold text-purple-600">1</p>
          </div>
        </div>

        <!-- Search and Filters -->
        <div class="bg-white p-6 rounded-lg shadow mb-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Buscar y Filtrar</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Buscar buque</label>
              <input type="text" 
                     class="mt-1 block w-full rounded-md border-gray-300 px-3 py-2"
                     placeholder="Ingrese nombre o número IMO">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Estado</label>
              <select class="mt-1 block w-full rounded-md border-gray-300 px-3 py-2">
                <option value="">Todos los estados</option>
                <option value="active">Activo</option>
                <option value="maintenance">En Mantenimiento</option>
                <option value="in_transit">En Tránsito</option>
              </select>
            </div>
            <div>
              <button class="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Limpiar Filtros
              </button>
            </div>
          </div>
        </div>

        <!-- Simple Table -->
        <div class="bg-white p-6 rounded-lg shadow">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Flota de Buques</h2>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capacidad</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div class="font-medium text-gray-900">MV Neptune</div>
                      <div class="text-sm text-gray-500">IMO: 9876545</div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">Portacontenedor</td>
                  <td class="px-6 py-4 whitespace-nowrap">10,000 TEU</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Activo</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex space-x-2">
                      <button class="text-blue-600 hover:text-blue-800 underline">Ver</button>
                      <button class="text-gray-600 hover:text-gray-800 underline">Editar</button>
                    </div>
                  </td>
                </tr>
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div class="font-medium text-gray-900">MV Atlantic</div>
                      <div class="text-sm text-gray-500">IMO: 9876546</div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">Portacontenedor</td>
                  <td class="px-6 py-4 whitespace-nowrap">12,000 TEU</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">En Tránsito</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex space-x-2">
                      <button class="text-blue-600 hover:text-blue-800 underline">Ver</button>
                      <button class="text-gray-600 hover:text-gray-800 underline">Editar</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Add Button -->
        <div class="flex justify-end">
          <button class="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700">
            Agregar Buque
          </button>
        </div>

        <!-- Navigation -->
        <div class="mt-8 text-center">
          <a href="/" class="text-blue-600 hover:text-blue-800 underline">
            ← Volver al Inicio
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class VesselManagementSimpleComponent {
  title = 'Vessel Management';
  
  // Simple methods for demonstration
  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    console.log('Searching for:', target.value);
  }
  
  onClearFilters() {
    console.log('Clearing filters');
  }
  
  onAddVessel() {
    console.log('Adding new vessel');
  }
  
  onViewVessel(vessel: any) {
    console.log('Viewing vessel:', vessel);
  }
  
  onEditVessel(vessel: any) {
    console.log('Editing vessel:', vessel);
  }
}
