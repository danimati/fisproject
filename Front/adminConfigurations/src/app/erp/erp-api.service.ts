import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { EntityKey, getEntityConfig } from './erp-config';

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

  constructor(private http: HttpClient) {}

  private apiPath(entityKey: EntityKey): string {
    return `${this.API_BASE}/api/v1/${getEntityConfig(entityKey).endpoint}`;
  }

  list<T>(entityKey: EntityKey, params?: Record<string, any>): Observable<PaginatedResponse<T>> {
    let httpParams = new HttpParams();

    Object.entries(params ?? {}).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        httpParams = httpParams.set(key, String(value));
      }
    });

    return this.http.get<PaginatedResponse<T>>(this.apiPath(entityKey), { params: httpParams });
  }

  get<T>(entityKey: EntityKey, id: string | number): Observable<T> {
    return this.http.get<T>(`${this.apiPath(entityKey)}/${id}`);
  }

  create<T>(entityKey: EntityKey, payload: Record<string, any>): Observable<T> {
    return this.http.post<T>(this.apiPath(entityKey), payload);
  }

  update<T>(entityKey: EntityKey, id: string | number, payload: Record<string, any>): Observable<T> {
    return this.http.put<T>(`${this.apiPath(entityKey)}/${id}`, payload);
  }

  remove(entityKey: EntityKey, id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.apiPath(entityKey)}/${id}`);
  }

  health(): Observable<HealthResponse> {
    return this.http.get<HealthResponse>(`${this.API_BASE}/api/v1/health`);
  }

  ready(): Observable<HealthResponse> {
    return this.http.get<HealthResponse>(`${this.API_BASE}/api/v1/ready`);
  }
}
