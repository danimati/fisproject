import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, shareReplay, tap } from 'rxjs/operators';
import { EntityKey, getEntityConfig } from './erp-config';

interface CacheEntry {
  expiresAt: number;
  value: unknown;
}

export interface ErpRequestOptions {
  /** Si true, omite la caché y vuelve a pedir al servidor. */
  force?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ErpApiCacheService {
  private readonly ttlMs = 3 * 60 * 1000;
  private readonly store = new Map<string, CacheEntry>();
  private readonly inflight = new Map<string, Observable<unknown>>();

  getOrFetch<T>(key: string, factory: () => Observable<T>, options?: ErpRequestOptions): Observable<T> {
    if (!options?.force) {
      const cached = this.read<T>(key);
      if (cached !== null) {
        return of(cached);
      }

      const pending = this.inflight.get(key);
      if (pending) {
        return pending as Observable<T>;
      }
    } else {
      this.invalidateKey(key);
    }

    const request$ = factory().pipe(
      tap((value) => {
        this.write(key, value);
        this.inflight.delete(key);
      }),
      catchError((error) => {
        this.inflight.delete(key);
        return throwError(() => error);
      }),
      shareReplay({ bufferSize: 1, refCount: false })
    );

    this.inflight.set(key, request$);
    return request$;
  }

  buildListKey(entityKey: EntityKey, query: string): string {
    const endpoint = getEntityConfig(entityKey).endpoint;
    return `GET|list|${endpoint}|${query}`;
  }

  buildItemKey(entityKey: EntityKey, id: string | number): string {
    const endpoint = getEntityConfig(entityKey).endpoint;
    return `GET|item|${endpoint}|${id}`;
  }

  buildUrlKey(method: string, url: string, query = ''): string {
    return `${method}|url|${url}|${query}`;
  }

  invalidateEntity(entityKey: EntityKey): void {
    const endpoint = getEntityConfig(entityKey).endpoint;
    const marker = `|${endpoint}|`;
    this.deleteMatching((key) => key.includes(marker));
  }

  clearAll(): void {
    this.store.clear();
    this.inflight.clear();
  }

  private read<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) {
      return null;
    }
    if (Date.now() >= entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.value as T;
  }

  private write(key: string, value: unknown): void {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + this.ttlMs
    });
  }

  private invalidateKey(key: string): void {
    this.store.delete(key);
    this.inflight.delete(key);
  }

  private deleteMatching(predicate: (key: string) => boolean): void {
    for (const key of [...this.store.keys()]) {
      if (predicate(key)) {
        this.store.delete(key);
      }
    }
    for (const key of [...this.inflight.keys()]) {
      if (predicate(key)) {
        this.inflight.delete(key);
      }
    }
  }
}
