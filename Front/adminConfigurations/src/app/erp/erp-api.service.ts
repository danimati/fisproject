import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { EntityKey, getEntityConfig } from './erp-config';
import { ErpApiCacheService, ErpRequestOptions } from './erp-api-cache.service';

export interface PaginatedResponse<T = any> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface HealthResponse {
  status: string;
  timestamp?: string;
  service?: string;
  database?: string;
  error?: string;
}

@Injectable({ providedIn: 'root' })
export class ErpApiService {
  private readonly API_BASE = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private cache: ErpApiCacheService
  ) {}

  private collectionPath(entityKey: EntityKey): string {
    return `${this.API_BASE}/api/v1/${getEntityConfig(entityKey).endpoint}/`;
  }

  private itemPath(entityKey: EntityKey, id: string | number): string {
    return `${this.collectionPath(entityKey)}${id}`;
  }

  private buildHttpParams(params?: Record<string, any>): HttpParams {
    let httpParams = new HttpParams();

    Object.entries(params ?? {}).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        httpParams = httpParams.set(key, String(value));
      }
    });

    return httpParams;
  }

  list<T>(
    entityKey: EntityKey,
    params?: Record<string, any>,
    options?: ErpRequestOptions
  ): Observable<PaginatedResponse<T>> {
    const httpParams = this.buildHttpParams(params);
    const url = this.collectionPath(entityKey);
    const cacheKey = this.cache.buildListKey(entityKey, httpParams.toString());

    return this.cache.getOrFetch(
      cacheKey,
      () => this.http.get<PaginatedResponse<T>>(url, { params: httpParams }),
      options
    );
  }

  get<T>(entityKey: EntityKey, id: string | number, options?: ErpRequestOptions): Observable<T> {
    const url = this.itemPath(entityKey, id);
    const cacheKey = this.cache.buildItemKey(entityKey, id);

    return this.cache.getOrFetch(
      cacheKey,
      () => this.http.get<T>(url),
      options
    );
  }

  create<T>(entityKey: EntityKey, payload: Record<string, any>): Observable<T> {
    return this.http.post<T>(this.collectionPath(entityKey), payload).pipe(
      tap(() => this.cache.invalidateEntity(entityKey))
    );
  }

  update<T>(entityKey: EntityKey, id: string | number, payload: Record<string, any>): Observable<T> {
    return this.http.put<T>(this.itemPath(entityKey, id), payload).pipe(
      tap(() => this.cache.invalidateEntity(entityKey))
    );
  }

  remove(entityKey: EntityKey, id: string | number): Observable<void> {
    return this.http.delete<void>(this.itemPath(entityKey, id)).pipe(
      tap(() => this.cache.invalidateEntity(entityKey))
    );
  }

  health(options?: ErpRequestOptions): Observable<HealthResponse> {
    const url = `${this.API_BASE}/health`;
    const cacheKey = this.cache.buildUrlKey('GET', url);

    return this.cache.getOrFetch(
      cacheKey,
      () => this.http.get<HealthResponse>(url),
      options
    );
  }

  ready(options?: ErpRequestOptions): Observable<HealthResponse> {
    return this.health(options);
  }
}
