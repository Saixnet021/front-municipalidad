import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PagoService {
    private apiUrl = 'http://localhost:8080/api/v1/arbitrios';

    constructor(private http: HttpClient) { }

    consultarDeudas(dni: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/deudas/${dni}`);
    }

    procesarPago(pagoRequest: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/pagos/procesar`, pagoRequest);
    }
}
