import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ErpApiService } from './erp-api.service';
import { ENTITY_KEYS, getEntityConfig, EntityKey } from './erp-config';
import { ErpAuthService } from './erp-auth.service';

@Component({
  selector: 'app-erp-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-6">
      <section class="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div class="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <p class="text-[11px] font-bold uppercase tracking-[0.28em] text-slate-400">Resumen</p>
          <div class="mt-3 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 class="text-3xl font-black tracking-tight text-slate-900">Maritime ERP dashboard</h1>
              <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Un espacio unificado para catálogos operativos, trazabilidad logística y gestión de datos a través del API de backend.</p>
            </div>
            <div class="flex flex-wrap gap-2">
              <a routerLink="/erp/vessels" class="rounded-2xl bg-[#f9ca3e] px-4 py-3 text-sm font-bold text-[#465b59] transition hover:brightness-95">Abrir flota</a>
              <a routerLink="/erp/cargo" class="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-[#f9ca3e]">Abrir registro de carga</a>
            </div>
          </div>
        </div>

        <div class="rounded-[1.75rem] border border-slate-200 bg-[#465b59] p-6 text-white shadow-sm">
          <p class="text-[11px] font-bold uppercase tracking-[0.28em] text-white/50">Sesión</p>
          <div class="mt-4 flex items-center gap-4">
            <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f9ca3e] text-[#465b59] shadow-lg">
              <span class="material-symbols-outlined text-[24px]">verified_user</span>
            </div>
            <div>
              <p class="text-xl font-black">{{ currentUser?.username || 'Administrador' }}</p>
              <p class="text-sm text-white/70">{{ currentUser?.email || 'Sin usuario cargado' }}</p>
            </div>
          </div>
          <div class="mt-6 grid gap-3 sm:grid-cols-3">
            <div class="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
              <p class="text-[10px] uppercase tracking-[0.24em] text-white/50">Autenticación</p>
              <p class="mt-2 text-sm font-bold">Token del gateway</p>
            </div>
            <div class="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
              <p class="text-[10px] uppercase tracking-[0.24em] text-white/50">API</p>
              <p class="mt-2 text-sm font-bold">Respaldado por proxy</p>
            </div>
            <div class="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
              <p class="text-[10px] uppercase tracking-[0.24em] text-white/50">Modo</p>
              <p class="mt-2 text-sm font-bold">Interfaz independiente</p>
            </div>
          </div>
        </div>
      </section>

      <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article *ngFor="let card of summaryCards" class="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">{{ card.label }}</p>
              <h3 class="mt-2 text-3xl font-black text-slate-900">{{ card.value }}</h3>
            </div>
            <div class="flex h-11 w-11 items-center justify-center rounded-2xl" [ngClass]="card.bgClass">
              <span class="material-symbols-outlined text-[20px]" [ngClass]="card.iconClass">{{ card.icon }}</span>
            </div>
          </div>
          <p class="mt-3 text-sm text-slate-500">{{ card.helper }}</p>
        </article>
      </section>

      <section class="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div class="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div class="flex items-center justify-between gap-4">
            <div>
              <p class="text-[11px] font-bold uppercase tracking-[0.28em] text-slate-400">Conectividad</p>
              <h2 class="mt-2 text-2xl font-black text-slate-900">Estado del servicio</h2>
            </div>
            <button (click)="reload()" class="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-[#f9ca3e]">Actualizar</button>
          </div>

          <div class="mt-5 grid gap-4 lg:grid-cols-2">
            <div class="rounded-2xl bg-slate-50 p-5">
              <p class="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400">Estado del backend</p>
              <p class="mt-3 text-3xl font-black" [ngClass]="healthColor">{{ backendHealth || 'desconocido' }}</p>
              <p class="mt-2 text-sm text-slate-500">{{ backendHealthMessage }}</p>
            </div>
            <div class="rounded-2xl bg-slate-50 p-5">
              <p class="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400">Disponibilidad</p>
              <p class="mt-3 text-3xl font-black" [ngClass]="readyColor">{{ readyState || 'desconocido' }}</p>
              <p class="mt-2 text-sm text-slate-500">{{ readyMessage }}</p>
            </div>
          </div>
        </div>

        <div class="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <p class="text-[11px] font-bold uppercase tracking-[0.28em] text-slate-400">Navegación rápida</p>
          <div class="mt-4 grid gap-3">
            <a *ngFor="let key of quickLinks" [routerLink]="['/erp', key]" class="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3.5 transition hover:border-[#f9ca3e] hover:bg-[#f9ca3e]/5">
              <div>
                <p class="text-sm font-bold text-slate-900">{{ getTitle(key) }}</p>
                <p class="text-xs text-slate-500">Abrir vistas de lista, detalle y formulario</p>
              </div>
              <span class="material-symbols-outlined text-slate-400">arrow_forward</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [``]
})
export class ErpDashboardComponent implements OnInit {
  readonly quickLinks: EntityKey[] = ENTITY_KEYS;
  summaryCards: Array<{ label: string; value: string; helper: string; icon: string; bgClass: string; iconClass: string }> = [];
  backendHealth = 'desconocido';
  backendHealthMessage = 'Esperando respuesta...';
  readyState = 'desconocido';
  readyMessage = 'Esperando respuesta...';

  constructor(private api: ErpApiService, private auth: ErpAuthService) {}

  get currentUser() {
    return this.auth.currentUser;
  }

  ngOnInit(): void {
    this.reload();
  }

  get healthColor(): string {
    return this.backendHealth === 'healthy' || this.backendHealth === 'ready' ? 'text-emerald-600' : 'text-slate-400';
  }

  get readyColor(): string {
    return this.readyState === 'ready' ? 'text-emerald-600' : 'text-slate-400';
  }

  getTitle(key: EntityKey): string {
    return getEntityConfig(key).title;
  }

  reload(): void {
    forkJoin({
      health: this.api.health(),
      ready: this.api.ready(),
      vessels: this.api.list('vessels', { page: 1, size: 1 }),
      containers: this.api.list('containers', { page: 1, size: 1 }),
      cargo: this.api.list('cargo', { page: 1, size: 1 }),
      shipments: this.api.list('shipments', { page: 1, size: 1 })
    }).subscribe({
      next: (result) => {
        this.backendHealth = result.health.status;
        this.backendHealthMessage = result.health.service ? `Servicio: ${result.health.service}` : 'Proxy del gateway hacia el API de backend';
        this.readyState = result.ready.status;
        this.readyMessage = result.ready.database ? `Base de datos: ${result.ready.database}` : 'Verificación de disponibilidad completada';

        this.summaryCards = [
          {
            label: 'Buques',
            value: result.vessels.total.toLocaleString(),
            helper: 'Registros del catálogo de flota',
            icon: 'directions_boat',
            bgClass: 'bg-sky-50',
            iconClass: 'text-sky-600'
          },
          {
            label: 'Contenedores',
            value: result.containers.total.toLocaleString(),
            helper: 'Registros de inventario y estado',
            icon: 'inventory_2',
            bgClass: 'bg-emerald-50',
            iconClass: 'text-emerald-600'
          },
          {
            label: 'Carga',
            value: result.cargo.total.toLocaleString(),
            helper: 'Entradas del registro de carga',
            icon: 'warehouse',
            bgClass: 'bg-amber-50',
            iconClass: 'text-amber-600'
          },
          {
            label: 'Embarques',
            value: result.shipments.total.toLocaleString(),
            helper: 'Movimientos activos e históricos',
            icon: 'local_shipping',
            bgClass: 'bg-violet-50',
            iconClass: 'text-violet-600'
          }
        ];
      },
      error: () => {
        this.backendHealth = 'sin conexión';
        this.backendHealthMessage = 'No fue posible conectar con el API de backend a través del gateway.';
        this.readyState = 'sin conexión';
        this.readyMessage = 'La verificación de disponibilidad falló.';
      }
    });
  }
}
