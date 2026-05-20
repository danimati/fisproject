import { AsyncPipe, CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ErpAuthService } from './erp-auth.service';
import { ENTITY_KEYS, getEntityConfig } from './erp-config';

@Component({
  selector: 'app-erp-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, AsyncPipe],
  template: `
    <div class="min-h-screen bg-[linear-gradient(180deg,#faf7ef_0%,#f6f7fb_45%,#eef2f7_100%)] text-slate-900">
      <aside class="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-slate-200/80 bg-[#465b59] text-white shadow-2xl lg:flex">
        <div class="flex items-center gap-3 border-b border-white/10 px-6 py-5">
          <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f9ca3e] text-[#465b59] shadow-lg">
            <span class="material-symbols-outlined text-[20px]">local_shipping</span>
          </div>
          <div>
            <p class="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/60">ERP independiente</p>
            <h1 class="text-lg font-bold leading-tight">Control Logisync</h1>
          </div>
        </div>

        <nav class="flex-1 overflow-y-auto px-4 py-5">
          <a routerLink="/erp/dashboard" routerLinkActive="bg-white/12 text-white" class="mb-2 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10">
            <span class="material-symbols-outlined text-[20px]">dashboard</span>
            <span>Panel principal</span>
          </a>
          <p class="px-4 pb-2 pt-4 text-[10px] font-bold uppercase tracking-[0.28em] text-white/40">Operaciones</p>
          <a *ngFor="let key of entityKeys" [routerLink]="['/erp', key]" routerLinkActive="bg-white/12 text-white" class="mb-2 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10">
            <span class="material-symbols-outlined text-[20px]">{{ getEntityIcon(key) }}</span>
            <span>{{ getEntityTitle(key) }}</span>
          </a>
        </nav>

        <div class="border-t border-white/10 p-4">
          <a routerLink="/dashboard" class="mb-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/10">
            <span class="material-symbols-outlined text-[18px]">admin_panel_settings</span>
            Interfaz del gateway
          </a>
          <button (click)="logout()" class="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#f9ca3e] px-4 py-3 text-sm font-bold text-[#465b59] shadow-lg transition hover:brightness-95">
            <span class="material-symbols-outlined text-[18px]">logout</span>
            Cerrar sesión
          </button>
        </div>
      </aside>

      <div class="lg:pl-72">
        <header class="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
          <div class="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f9ca3e] text-[#465b59] shadow-sm lg:hidden">
                <span class="material-symbols-outlined text-[20px]">local_shipping</span>
              </div>
              <div>
                <p class="text-[11px] font-bold uppercase tracking-[0.28em] text-slate-400">Frontend independiente</p>
                <h2 class="text-sm font-semibold text-slate-900 sm:text-base">Panel operativo y espacio CRUD</h2>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <div class="hidden rounded-full border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500 md:flex">
                Conectado a la autenticación del gateway y al proxy del backend
              </div>
              <div class="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm">
                <div class="flex h-8 w-8 items-center justify-center rounded-full bg-[#465b59] text-xs font-bold text-white">
                  {{ (currentUser$ | async)?.username?.charAt(0)?.toUpperCase() || 'A' }}
                </div>
                <div class="hidden sm:block">
                  <p class="text-xs font-semibold leading-tight text-slate-900">{{ (currentUser$ | async)?.username || 'Administrador' }}</p>
                  <p class="text-[11px] text-slate-500">{{ (currentUser$ | async)?.email || 'Usuario ERP' }}</p>
                </div>
              </div>
              <button (click)="logout()" class="rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-[#f9ca3e] hover:text-[#465b59]">
                <span class="material-symbols-outlined text-[20px]">logout</span>
              </button>
            </div>
          </div>
        </header>

        <main class="px-4 py-6 sm:px-6 lg:px-8">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [``]
})
export class ErpLayoutComponent {
  readonly entityKeys = ENTITY_KEYS;
  readonly currentUser$;

  constructor(private auth: ErpAuthService) {
    this.currentUser$ = this.auth.user$;
  }

  getEntityTitle(entityKey: typeof ENTITY_KEYS[number]): string {
    return getEntityConfig(entityKey).title;
  }

  getEntityIcon(entityKey: typeof ENTITY_KEYS[number]): string {
    return getEntityConfig(entityKey).icon;
  }

  logout(): void {
    void this.auth.logout();
  }
}
