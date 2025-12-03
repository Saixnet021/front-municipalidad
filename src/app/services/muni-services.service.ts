import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MuniServicesService {

  private apiUrl = `${environment.apiUrl}/tramites`;

  constructor(private http: HttpClient) { }

  crearMesaDePartes(data: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/mesa-de-partes`, data);
  }

  solicitarConstanciaResidencia(data: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/constancia`, data);
  }

  emitirLicenciaFuncionamiento(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/licencia`, data);
  }

  pagarArbitrios(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/pago-arbitrios`, data);
  }

  buscarTramitePorExpediente(expediente: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/expediente/${expediente}`);
  }

  buscarTramitesPorUsuario(usuario: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuario/${usuario}`);
  }
}
