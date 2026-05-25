import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';

export interface VesselApiResponse {
  items: Vessel[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface Vessel {
  id: string;
  name: string;
  imo_number: string;
  flag_country: string;
  vessel_type: string;
  deadweight_tonnage: number;
  gross_tonnage: number;
  length_overall: number;
  beam: number;
  draft: number;
  max_containers: number | null;
  max_cargo_weight: number;
  status: string;
  created_at: string;
  updated_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class VesselService {
  private readonly API_BASE: string;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this.API_BASE = this.configService.getApiUrl();
  }

  getVessels(page: number = 1, size: number = 25): Observable<VesselApiResponse> {
    return this.http.get<VesselApiResponse>(`${this.API_BASE}/api/v1/vessels/`, {
      params: { page: page.toString(), size: size.toString() }
    });
  }

  getVesselById(id: string): Observable<Vessel> {
    return this.http.get<Vessel>(`${this.API_BASE}/api/v1/vessels/${id}`);
  }

  updateVessel(id: string, vesselData: Partial<Vessel>): Observable<Vessel> {
    // Convert status to uppercase for backend
    const payload = { ...vesselData };
    if (payload.status) {
      payload.status = payload.status.toUpperCase() as any;
    }
    return this.http.put<Vessel>(`${this.API_BASE}/api/v1/vessels/${id}`, payload);
  }
}
