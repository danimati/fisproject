import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ErpApiService } from './erp-api.service';
import { ColumnConfig, ENTITY_KEYS, EntityKey, FieldConfig, getEntityConfig, getHumanizedValue } from './erp-config';

type EntityMode = 'list' | 'create' | 'detail' | 'edit';

@Component({
  selector: 'app-erp-entity-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="space-y-6">
      <section class="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div class="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p class="text-[11px] font-bold uppercase tracking-[0.28em] text-slate-400">{{ modeLabel }}</p>
            <h1 class="mt-2 text-3xl font-black tracking-tight text-slate-900">{{ config.title }}</h1>
            <p class="mt-2 max-w-3xl text-sm leading-6 text-slate-500">{{ config.description }}</p>
          </div>
          <div class="flex flex-wrap gap-2">
            <button *ngIf="mode === 'list'" (click)="openCreate()" class="rounded-2xl bg-[#f9ca3e] px-4 py-3 text-sm font-black text-[#465b59] transition hover:brightness-95">Crear registro</button>
            <button (click)="reload()" class="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-[#f9ca3e]">Actualizar</button>
            <a routerLink="/erp/dashboard" class="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-[#f9ca3e]">Volver al panel</a>
          </div>
        </div>
      </section>

      <section class="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div class="space-y-6">
          <div class="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div class="grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
              <div class="relative">
                <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                <input [(ngModel)]="searchTerm" (input)="applySearch()" type="text" class="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm outline-none transition focus:border-[#f9ca3e] focus:ring-4 focus:ring-[#f9ca3e]/15" [placeholder]="config.searchHint" />
              </div>
              <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" *ngIf="filterFields.length">
                <ng-container *ngFor="let filter of filterFields">
                  <ng-container [ngSwitch]="filter.type">
                    <select *ngSwitchCase="'select'" [(ngModel)]="filters[filter.key]" (change)="reload()" class="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none transition focus:border-[#f9ca3e] focus:ring-4 focus:ring-[#f9ca3e]/15">
                      <option value="">{{ filter.label }}</option>
                      <option *ngFor="let option of filter.options || []" [ngValue]="option.value">{{ option.label }}</option>
                    </select>
                    <input *ngSwitchDefault [(ngModel)]="filters[filter.key]" (input)="reload()" type="text" class="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none transition focus:border-[#f9ca3e] focus:ring-4 focus:ring-[#f9ca3e]/15" [placeholder]="filter.label" />
                  </ng-container>
                </ng-container>
              </div>
            </div>
          </div>

          <div class="rounded-[1.75rem] border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-slate-100 text-left">
                <thead class="bg-slate-50">
                  <tr>
                    <th *ngFor="let column of config.columns" class="px-5 py-4 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">{{ column.label }}</th>
                    <th class="px-5 py-4 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">Acciones</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 bg-white">
                  <tr *ngFor="let item of visibleItems" class="cursor-pointer transition hover:bg-[#f9ca3e]/5" (click)="selectItem(item)">
                    <td *ngFor="let column of config.columns" class="px-5 py-4 text-sm text-slate-700">
                      <ng-container [ngSwitch]="column.kind">
                        <span *ngSwitchCase="'boolean'" [class]="item[column.key] ? 'rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700' : 'rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500'">{{ item[column.key] ? 'Yes' : 'No' }}</span>
                        <span *ngSwitchCase="'badge'" class="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">{{ humanize(item[column.key]) }}</span>
                        <span *ngSwitchCase="'date'">{{ formatDate(item[column.key]) }}</span>
                        <span *ngSwitchDefault>{{ resolveColumnValue(column, item) }}</span>
                      </ng-container>
                    </td>
                    <td class="px-5 py-4 text-sm text-slate-700">
                      <div class="flex gap-2" (click)="$event.stopPropagation()">
                        <button (click)="openDetail(item)" class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold transition hover:border-[#f9ca3e]">Ver</button>
                        <button (click)="openEdit(item)" class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold transition hover:border-[#f9ca3e]">Editar</button>
                        <button (click)="remove(item)" class="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 transition hover:border-rose-300">Eliminar</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="flex items-center justify-between border-t border-slate-100 px-5 py-4 text-sm text-slate-500">
              <p>Mostrando {{ visibleItems.length }} de {{ totalItems }} registros</p>
              <div class="flex items-center gap-2">
                <button (click)="previousPage()" [disabled]="page <= 1" class="rounded-xl border border-slate-200 bg-white px-3 py-2 font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40">Anterior</button>
                <span class="rounded-xl bg-slate-100 px-3 py-2 font-bold text-slate-700">{{ page }} / {{ pages }}</span>
                <button (click)="nextPage()" [disabled]="page >= pages" class="rounded-xl border border-slate-200 bg-white px-3 py-2 font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40">Siguiente</button>
              </div>
            </div>
          </div>
        </div>

        <aside class="space-y-6">
          <section *ngIf="mode === 'detail' || mode === 'edit' || mode === 'create' || selectedItem" class="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="text-[11px] font-bold uppercase tracking-[0.28em] text-slate-400">{{ mode === 'create' ? 'Crear registro' : mode === 'edit' ? 'Editar registro' : 'Registro seleccionado' }}</p>
                <h2 class="mt-2 text-2xl font-black text-slate-900">{{ detailTitle }}</h2>
              </div>
              <button *ngIf="mode !== 'list'" (click)="backToList()" class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold">Volver</button>
            </div>

            <div *ngIf="mode === 'detail' && selectedItem" class="mt-5 space-y-4 rounded-2xl bg-slate-50 p-4">
              <div *ngFor="let field of config.formFields" class="flex items-center justify-between gap-4 border-b border-white/60 pb-3 last:border-0 last:pb-0">
                <p class="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">{{ field.label }}</p>
                <p class="text-sm font-semibold text-slate-800">{{ displayFieldValue(field, selectedItem) }}</p>
              </div>
            </div>

            <form *ngIf="mode === 'create' || mode === 'edit'" [formGroup]="form" (ngSubmit)="submit()" class="mt-5 space-y-4">
              <ng-container *ngFor="let field of config.formFields">
                <label class="block">
                  <span class="mb-2 block text-sm font-semibold text-slate-700">{{ field.label }}</span>
                  <ng-container [ngSwitch]="field.type">
                    <textarea *ngSwitchCase="'textarea'" [rows]="field.rows || 4" [formControlName]="field.key" class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#f9ca3e] focus:ring-4 focus:ring-[#f9ca3e]/15"></textarea>
                    <input *ngSwitchCase="'checkbox'" [formControlName]="field.key" type="checkbox" class="h-4 w-4 rounded border-slate-300 text-[#f9ca3e] focus:ring-[#f9ca3e]" />
                    <select *ngSwitchCase="'select'" [formControlName]="field.key" class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#f9ca3e] focus:ring-4 focus:ring-[#f9ca3e]/15">
                      <option value="">Select {{ field.label }}</option>
                      <option *ngFor="let option of optionsFor(field)" [ngValue]="option.value">{{ option.label }}</option>
                    </select>
                    <input *ngSwitchCase="'date'" [formControlName]="field.key" type="date" class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#f9ca3e] focus:ring-4 focus:ring-[#f9ca3e]/15" />
                    <input *ngSwitchCase="'datetime'" [formControlName]="field.key" type="datetime-local" class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#f9ca3e] focus:ring-4 focus:ring-[#f9ca3e]/15" />
                    <input *ngSwitchDefault [formControlName]="field.key" [type]="field.type === 'number' ? 'number' : 'text'" class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#f9ca3e] focus:ring-4 focus:ring-[#f9ca3e]/15" />
                  </ng-container>
                  <p *ngIf="field.helper" class="mt-1 text-xs text-slate-400">{{ field.helper }}</p>
                </label>
              </ng-container>

              <div class="flex gap-2 pt-2">
                <button type="submit" [disabled]="form.invalid || saving" class="flex-1 rounded-2xl bg-[#f9ca3e] px-4 py-3.5 text-sm font-black text-[#465b59] transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60">{{ saving ? 'Guardando...' : 'Guardar registro' }}</button>
                <button type="button" (click)="backToList()" class="rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-bold text-slate-700">Cancelar</button>
              </div>
            </form>
          </section>

          <section *ngIf="mode === 'list' && !selectedItem" class="rounded-[1.75rem] border border-dashed border-slate-200 bg-white/70 p-6 text-sm text-slate-500">
            Selecciona un registro para revisarlo o crea uno nuevo con la acción principal.
          </section>
        </aside>
      </section>
    </div>
  `,
  styles: [``]
})
export class ErpEntityPageComponent implements OnInit {
  config!: ReturnType<typeof getEntityConfig>;
  entityKey!: EntityKey;
  mode: EntityMode = 'list';
  modeLabel = 'Módulo';
  detailTitle = 'Registro';
  items: any[] = [];
  visibleItems: any[] = [];
  selectedItem: any | null = null;
  totalItems = 0;
  page = 1;
  pages = 1;
  size = 25;
  searchTerm = '';
  loading = false;
  saving = false;
  filters: Record<string, any> = {};
  form;
  filterFields: FieldConfig[] = [];
  private relationCache: Record<string, Array<{ value: string | number; label: string }>> = {};

  constructor(private route: ActivatedRoute, private router: Router, private fb: FormBuilder, private api: ErpApiService) {
    this.form = this.fb.group({});
  }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.entityKey = data['entityKey'];
      this.mode = data['mode'] ?? 'list';
      this.config = getEntityConfig(this.entityKey);
      this.modeLabel = this.mode === 'list' ? 'Vista de lista' : this.mode === 'create' ? 'Vista de creación' : this.mode === 'edit' ? 'Vista de edición' : 'Vista de detalle';
      const singular = this.singularTitle(this.config.title);
      this.detailTitle = this.mode === 'create' ? `Nuevo ${singular}` : this.mode === 'edit' ? `Editar ${singular}` : this.config.title;
      this.filterFields = this.config.filters ?? [];
      this.buildForm();
      this.loadRelations();
      this.reload();

      const id = this.route.snapshot.paramMap.get('id');
      if (id && this.mode !== 'list') {
        this.loadSelectedItem(id);
      }
    });

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (!id || !this.entityKey) {
        this.selectedItem = null;
        return;
      }

      this.loadSelectedItem(id);
    });
  }

  humanize(value: any): string {
    return getHumanizedValue(value);
  }

  singularTitle(title: string): string {
    return title.endsWith('s') ? title.slice(0, -1) : title;
  }

  loadSelectedItem(id: string): void {
    this.api.get(this.entityKey, id).subscribe({
      next: (item) => {
        this.selectedItem = item;
        this.detailTitle = this.mode === 'edit' ? `Editar ${this.displayName(item)}` : this.displayName(item);
        if (this.mode === 'edit') {
          this.patchForm(item);
        }
      },
      error: () => {
        this.selectedItem = null;
      }
    });
  }

  reload(): void {
    this.loading = true;
    this.api.list(this.entityKey, { page: this.page, size: this.size, ...this.activeFilters() }).subscribe({
      next: (response) => {
        this.items = response.items ?? [];
        this.totalItems = response.total;
        this.pages = response.pages || 1;
        this.applySearch();
        this.loading = false;
      },
      error: () => {
        this.items = [];
        this.visibleItems = [];
        this.totalItems = 0;
        this.pages = 1;
        this.loading = false;
      }
    });
  }

  applySearch(): void {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.visibleItems = [...this.items];
      return;
    }

    const searchableKeys = new Set(this.config.columns.map((column) => column.key));
    this.visibleItems = this.items.filter((item) => {
      return Array.from(searchableKeys).some((key) => String(item?.[key] ?? '').toLowerCase().includes(term));
    });
  }

  activeFilters(): Record<string, any> {
    return Object.fromEntries(
      Object.entries(this.filters).filter(([, value]) => value !== null && value !== undefined && value !== '')
    );
  }

  loadRelations(): void {
    const relationKeys = Array.from(new Set(this.config.formFields.filter((field) => field.relation).map((field) => field.relation as EntityKey)));
    if (!relationKeys.length) {
      return;
    }

    const requests: Record<string, any> = {};
    relationKeys.forEach((relationKey) => {
      requests[relationKey] = this.api.list(relationKey, { page: 1, size: 100 });
    });

    forkJoin(requests).subscribe({
      next: (result) => {
        relationKeys.forEach((relationKey) => {
          const relationConfig = getEntityConfig(relationKey);
          const response = result as Record<string, { items: any[] }>;
          this.relationCache[relationKey] = (response[relationKey].items || []).map((item: any) => ({
            value: item.id,
            label: relationConfig.listLabel(item)
          }));
        });
      }
    });
  }

  optionsFor(field: FieldConfig): Array<{ value: string | number; label: string }> {
    if (field.options) {
      return field.options as Array<{ value: string | number; label: string }>;
    }

    if (field.relation) {
      return this.relationCache[field.relation] ?? [];
    }

    return [];
  }

  buildForm(item?: any): void {
    const group: Record<string, any> = {};

    this.config.formFields.forEach((field) => {
      const validators = [];
      if (field.required) {
        validators.push(Validators.required);
      }
      if (field.type === 'number') {
        if (field.min !== undefined) validators.push(Validators.min(field.min));
        if (field.max !== undefined) validators.push(Validators.max(field.max));
      }
      group[field.key] = [item ? this.formValue(field, item[field.key]) : this.defaultValue(field), validators];
    });

    this.form = this.fb.group(group);
  }

  defaultValue(field: FieldConfig): any {
    if (field.type === 'checkbox') {
      return false;
    }
    return '';
  }

  formValue(field: FieldConfig, value: any): any {
    if (field.type === 'datetime' && value) {
      const date = new Date(value);
      return date.toISOString().slice(0, 16);
    }

    if (field.type === 'checkbox') {
      return !!value;
    }

    return value ?? this.defaultValue(field);
  }

  patchForm(item: any): void {
    const values: Record<string, any> = {};
    this.config.formFields.forEach((field) => {
      values[field.key] = this.formValue(field, item?.[field.key]);
    });
    this.form.patchValue(values);
  }

  resolveColumnValue(column: ColumnConfig, item: any): string {
    const value = item?.[column.key];
    if (column.relation) {
      return this.resolveRelationLabel(column.relation, value);
    }

    return this.humanize(value);
  }

  displayFieldValue(field: FieldConfig, item: any): string {
    const value = item?.[field.key];
    if (field.relation) {
      return this.resolveRelationLabel(field.relation, value);
    }

    if (field.type === 'checkbox') {
      return value ? 'Yes' : 'No';
    }

    if (field.type === 'datetime' || field.type === 'date') {
      return this.formatDate(value);
    }

    return this.humanize(value);
  }

  resolveRelationLabel(relation: EntityKey, value: any): string {
    const cached = this.relationCache[relation] ?? [];
    const match = cached.find((option) => String(option.value) === String(value));
    if (match) {
      return match.label;
    }

    return value ? String(value) : '-';
  }

  displayName(item: any): string {
    return this.config.listLabel(item);
  }

  formatDate(value: any): string {
    if (!value) {
      return '-';
    }

    return new Date(value).toLocaleString();
  }

  selectItem(item: any): void {
    this.selectedItem = item;
    this.detailTitle = this.displayName(item);
  }

  openCreate(): void {
    this.buildForm();
    void this.router.navigate(['/erp', this.entityKey, 'new']);
  }

  openDetail(item: any): void {
    void this.router.navigate(['/erp', this.entityKey, item.id]);
  }

  openEdit(item: any): void {
    void this.router.navigate(['/erp', this.entityKey, item.id, 'edit']);
  }

  backToList(): void {
    void this.router.navigate(['/erp', this.entityKey]);
  }

  submit(): void {
    if (this.form.invalid || this.saving) {
      return;
    }

    this.saving = true;
    const payload = this.serializePayload();
    const request$ = this.mode === 'edit' && this.selectedItem
      ? this.api.update(this.entityKey, this.selectedItem.id, payload)
      : this.api.create(this.entityKey, payload);

    request$.subscribe({
      next: (item: any) => {
        this.saving = false;
        void this.router.navigate(['/erp', this.entityKey, item.id]);
      },
      error: () => {
        this.saving = false;
      }
    });
  }

  serializePayload(): Record<string, any> {
    const raw: Record<string, any> = this.form.getRawValue() as Record<string, any>;
    const payload: Record<string, any> = {};

    this.config.formFields.forEach((field) => {
      let value = raw[field.key as keyof typeof raw];
      if (field.type === 'datetime' && value) {
        value = new Date(String(value)).toISOString();
      }
      if (field.type === 'number' && value !== '' && value !== null && value !== undefined) {
        value = Number(value);
      }
      payload[field.key] = value;
    });

    return payload;
  }

  remove(item: any): void {
    if (!confirm(`¿Eliminar ${this.displayName(item)}?`)) {
      return;
    }

    this.api.remove(this.entityKey, item.id).subscribe({
      next: () => this.reload(),
      error: () => undefined
    });
  }

  previousPage(): void {
    if (this.page <= 1) {
      return;
    }

    this.page -= 1;
    this.reload();
  }

  nextPage(): void {
    if (this.page >= this.pages) {
      return;
    }

    this.page += 1;
    this.reload();
  }
}
