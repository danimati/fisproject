import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { ConfigService } from './config.service';

export interface AdminStats {
  users: {
    total: number;
    active: number;
    admin: number;
  };
  sessions: {
    active: number;
  };
  activity: {
    requests_24h: number;
    blocked_24h: number;
    failed_logins_24h: number;
  };
  security: {
    currently_blocked: number;
  };
}

export interface User {
  id: string;
  username: string;
  email: string;
  full_name: string;
  phone: string;
  address: string;
  is_active: boolean;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  ip_address: string;
  endpoint: string;
  method: string;
  status_code: number;
  response_time: number;
  event_type: string;
  created_at: string;
  details?: any;
}

export interface BlockedIP {
  ip_address: string;
  request_count: number;
  block_expires: string;
  window_size: string;
}

export interface Role {
  id: string;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Permission {
  id: string;
  endpoint: string;
  httpType: string;
  type: string;
  description?: string;
  tag?: string;
  operationId?: string;
}

export interface RoleAssignment {
  id: string;
  user_id: string;
  rol_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  user_username: string;
  rol_nombre: string;
}

export interface UserPermission {
  id: string;
  user_id: string;
  permit_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  user_username: string;
  permit_endpoint: string;
  permit_description?: string;
}

export interface PerformanceMetrics {
  avg_response_time_ms: number;
  status_distribution: Array<{
    status_code: number;
    count: number;
  }>;
  top_endpoints: Array<{
    endpoint: string;
    count: number;
  }>;
}

export interface UserSession {
  id: string;
  created_at: string;
  expires_at: string;
  is_active: string;
  ip_address: string;
  user_agent: string;
}

@Injectable({
  providedIn: 'root'
})
export class GatewayService {
  private readonly API_BASE: string;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private configService: ConfigService
  ) {
    this.API_BASE = this.configService.getApiUrl();
  }

  private getHeaders(): HttpHeaders {
    return this.authService.getAuthHeaders();
  }

  // Dashboard
  getAdminStats(): Observable<AdminStats> {
    return this.http.get<AdminStats>(`${this.API_BASE}/admin/stats`, {
      headers: this.getHeaders()
    });
  }

  // User Management
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.API_BASE}/admin/users`, {
      headers: this.getHeaders()
    });
  }

  getUserSessions(userId: string): Observable<UserSession[]> {
    return this.http.get<UserSession[]>(`${this.API_BASE}/admin/users/${userId}/sessions`, {
      headers: this.getHeaders()
    });
  }

  toggleUserStatus(userId: string, activate: boolean): Observable<any> {
    const endpoint = activate ? 
      `${this.API_BASE}/admin/users/${userId}/activate` : 
      `${this.API_BASE}/admin/users/${userId}`;
    
    if (activate) {
      return this.http.post(endpoint, {}, {
        headers: this.getHeaders()
      });
    } else {
      return this.http.delete(endpoint, {
        headers: this.getHeaders()
      });
    }
  }

  createUser(userData: any): Observable<User> {
    return this.http.post<User>(`${this.API_BASE}/auth/register`, userData, {
      headers: this.getHeaders()
    });
  }

  // Security Management
  getBlockedIPs(): Observable<BlockedIP[]> {
    return this.http.get<BlockedIP[]>(`${this.API_BASE}/admin/security/blocked-ips`, {
      headers: this.getHeaders()
    });
  }

  unblockIP(ipHash: string): Observable<any> {
    return this.http.post(`${this.API_BASE}/admin/security/unblock-ip/${ipHash}`, {}, {
      headers: this.getHeaders()
    });
  }

  // Audit Logs
  getAuditLogs(params?: {
    limit?: number;
    offset?: number;
    event_type?: string;
  }): Observable<AuditLog[]> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    if (params?.offset) queryParams.set('offset', params.offset.toString());
    if (params?.event_type) queryParams.set('event_type', params.event_type);
    
    return this.http.get<AuditLog[]>(`${this.API_BASE}/admin/audit/logs?${queryParams}`, {
      headers: this.getHeaders()
    });
  }

  // Role Management
  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.API_BASE}/crud/roles`, {
      headers: this.getHeaders()
    });
  }

  createRole(roleData: any): Observable<Role> {
    return this.http.post<Role>(`${this.API_BASE}/crud/roles`, roleData, {
      headers: this.getHeaders()
    });
  }

  updateRole(roleId: string, roleData: any): Observable<Role> {
    return this.http.put<Role>(`${this.API_BASE}/crud/roles/${roleId}`, roleData, {
      headers: this.getHeaders()
    });
  }

  deleteRole(roleId: string): Observable<any> {
    return this.http.delete(`${this.API_BASE}/crud/roles/${roleId}`, {
      headers: this.getHeaders()
    });
  }

  // Permission Management
  getPermissions(): Observable<Permission[]> {
    return this.http.get<Permission[]>(`${this.API_BASE}/crud/permissions`, {
      headers: this.getHeaders()
    });
  }

  syncPermissions(): Observable<any> {
    return this.http.get(`${this.API_BASE}/admin/synchronization`, {
      headers: this.getHeaders()
    });
  }

  // Role Assignments
  getRoleAssignments(): Observable<RoleAssignment[]> {
    return this.http.get<RoleAssignment[]>(`${this.API_BASE}/crud/role-users`, {
      headers: this.getHeaders()
    });
  }

  // User Permissions
  getUserPermissions(): Observable<UserPermission[]> {
    return this.http.get<UserPermission[]>(`${this.API_BASE}/crud/user-permits`, {
      headers: this.getHeaders()
    });
  }

  // Performance Metrics
  getPerformanceMetrics(): Observable<PerformanceMetrics> {
    return this.http.get<PerformanceMetrics>(`${this.API_BASE}/admin/performance/metrics`, {
      headers: this.getHeaders()
    });
  }

  // Health Check
  getHealthCheck(): Observable<any> {
    return this.http.get(`${this.API_BASE}/health`);
  }

  getBackendHealth(): Observable<any> {
    return this.http.get(`${this.API_BASE}/api/v1/health`);
  }
}
