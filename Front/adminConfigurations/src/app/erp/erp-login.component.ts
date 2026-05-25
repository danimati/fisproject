import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ErpAuthService } from './erp-auth.service';
import { getBootstrapIconClass } from './erp-config';

@Component({
  selector: 'app-erp-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(249,202,62,0.16),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(54,201,198,0.15),_transparent_35%),linear-gradient(180deg,#f8f7f2_0%,#eff3f7_100%)] px-4 py-10 text-slate-900">
      <div class="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
        <div class="grid w-full overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 shadow-[0_30px_100px_rgba(15,23,42,0.14)] backdrop-blur-xl lg:grid-cols-[1.05fr_0.95fr]">
          <section class="relative overflow-hidden bg-[#465b59] px-8 py-10 text-white sm:px-10">
            <div class="absolute inset-0 bg-[linear-gradient(135deg,rgba(249,202,62,0.18)_0%,rgba(249,202,62,0.02)_36%,rgba(54,201,198,0.16)_100%)]"></div>
            <div class="relative z-10 flex h-full flex-col justify-between gap-10">
              <div>
                <div class="mb-6 inline-flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/10">
                  <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f9ca3e] text-[#465b59]">
                    <i class="bi text-[20px]" [ngClass]="getBootstrapIconClass('domain')"></i>
                  </div>
                  <div>
                    <p class="text-[11px] font-bold uppercase tracking-[0.28em] text-white/60">Portal de acceso</p>
                    <p class="text-lg font-bold leading-tight">Docker-is-able</p>
                  </div>
                </div>

                <h1 class="max-w-md text-4xl font-black tracking-tight sm:text-5xl">ERP completo para su gestión maritima.</h1>
                <p class="mt-5 max-w-lg text-sm leading-6 text-white/75 sm:text-base">Sistema de gestión empresarial, logística y admnistrativa para el monitoreo y trazabilidad de contenedores de carga a nivel internacional.</p>
              </div>

              <div class="grid gap-3 sm:grid-cols-3">
                <div class="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
                  <p class="text-[11px] uppercase tracking-[0.24em] text-white/55">Alcance</p>
                  <p class="mt-2 text-sm font-semibold">Trazabilidad + Monitorización</p>
                </div>
                <div class="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
                  <p class="text-[11px] uppercase tracking-[0.24em] text-white/55">Disponibilidad</p>
                  <p class="mt-2 text-sm font-semibold">Operatividad 24/7</p>
                </div>
                <div class="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
                  <p class="text-[11px] uppercase tracking-[0.24em] text-white/55">Accesibilidad</p>
                  <p class="mt-2 text-sm font-semibold">Interfaz simple y sencilla para la gestión</p>
                </div>
              </div>
            </div>
          </section>

          <section class="px-6 py-8 sm:px-10 sm:py-10">
            <div class="mx-auto flex max-w-md flex-col justify-center">
              <div class="mb-8 text-center">
                <p class="text-[11px] font-bold uppercase tracking-[0.28em] text-slate-400">Iniciar sesión</p>
                <p class="mt-3 text-sm text-slate-500">Digite a continuacion sus credenciales de inicio de sesión</p>
              </div>

              <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-4">
                <label class="block">
                  <span class="mb-2 block text-sm font-semibold text-slate-700">Usuario</span>
                  <input formControlName="username" type="text" class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#f9ca3e] focus:ring-4 focus:ring-[#f9ca3e]/15" placeholder="usuario" />
                </label>
                <label class="block">
                  <span class="mb-2 block text-sm font-semibold text-slate-700">Contraseña</span>
                  <input formControlName="password" type="password" class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#f9ca3e] focus:ring-4 focus:ring-[#f9ca3e]/15" placeholder="••••••••" />
                </label>

                <div *ngIf="errorMessage" class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {{ errorMessage }}
                </div>

                <button type="submit" [disabled]="form.invalid || loading" class="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#f9ca3e] px-4 py-3.5 text-sm font-black text-[#465b59] shadow-[0_16px_30px_rgba(249,202,62,0.28)] transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60">
                  <i *ngIf="loading" class="bi animate-spin text-[18px]" [ngClass]="getBootstrapIconClass('progress_activity')"></i>
                  <span>{{ loading ? 'Ingresando...' : 'Entrar al panel' }}</span>
                </button>
              </form>

            </div>
          </section>
        </div>
      </div>
    </div>
  `,
  styles: [``]
})
export class ErpLoginComponent {
  loading = false;
  errorMessage = '';
  form;
  readonly getBootstrapIconClass = getBootstrapIconClass;

  private readonly cdr = inject(ChangeDetectorRef);

  constructor(private fb: FormBuilder, private auth: ErpAuthService, private router: Router) {
    this.form = this.fb.nonNullable.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  submit(): void {
    if (this.form.invalid || this.loading) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.auth.login(this.form.getRawValue()).subscribe({
      next: async () => {
        this.loading = false;
        this.cdr.detectChanges();
        await this.router.navigate(['/erp/dashboard']);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error?.error?.detail || 'El inicio de sesión falló. Verifica las credenciales y la disponibilidad del backend.';
        this.cdr.detectChanges();
      }
    });
  }
}
