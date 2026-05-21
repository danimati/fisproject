import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50 p-8">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl font-bold text-gray-900 mb-8">Componentes Reutilizables - Demo</h1>
        
        <!-- Demo Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Button Demo -->
          <div class="bg-white p-6 rounded-lg shadow">
            <h2 class="text-lg font-semibold mb-4">Botones</h2>
            <div class="space-y-4">
              <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Botón Primario
              </button>
              <button class="border border-gray-300 px-4 py-2 rounded hover:bg-gray-50">
                Botón Secundario
              </button>
              <button class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                Botón Peligro
              </button>
            </div>
          </div>

          <!-- Input Demo -->
          <div class="bg-white p-6 rounded-lg shadow">
            <h2 class="text-lg font-semibold mb-4">Campos de Entrada</h2>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" 
                       class="mt-1 block w-full rounded-md border-gray-300 px-3 py-2"
                       placeholder="correo@ejemplo.com">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Contraseña</label>
                <input type="password" 
                       class="mt-1 block w-full rounded-md border-gray-300 px-3 py-2"
                       placeholder="••••••••">
              </div>
            </div>
          </div>

          <!-- Badge Demo -->
          <div class="bg-white p-6 rounded-lg shadow">
            <h2 class="text-lg font-semibold mb-4">Insignias</h2>
            <div class="flex flex-wrap gap-2">
              <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Activo</span>
              <span class="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">Mantenimiento</span>
              <span class="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">Inactivo</span>
              <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">En Tránsito</span>
            </div>
          </div>

          <!-- Table Demo -->
          <div class="bg-white p-6 rounded-lg shadow">
            <h2 class="text-lg font-semibold mb-4">Tabla</h2>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacidad</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr>
                    <td class="px-6 py-4 whitespace-nowrap">MV Neptune</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Activo</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">10,000 TEU</td>
                  </tr>
                  <tr>
                    <td class="px-6 py-4 whitespace-nowrap">MV Atlantic</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">En Tránsito</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">12,000 TEU</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
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
export class DemoComponent {
  title = 'Componentes Demo';
}
