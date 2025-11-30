import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MuniServicesService {

  private baseUrl = '/api/municipalidad';

  constructor(private http: HttpClient) { }

  crearMesaDePartes(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/mesa-de-partes`, data);
  }

  solicitarConstanciaResidencia(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/constancia-residencia`, data);
  }

  emitirLicenciaFuncionamiento(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/licencia-funcionamiento`, data);
  }

  pagarArbitrios(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/pago-arbitrios`, data);
  }
}
