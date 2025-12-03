import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PagoService {
    private apiUrl = `${environment.apiUrl}/arbitrios`;

    constructor(private http: HttpClient) { }

    consultarDeudas(dni: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/deudas/${dni}`);
    }

    procesarPago(pagoRequest: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/pagos/procesar`, pagoRequest);
    }

    realizarPagoSimulado(id: number, cardData: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/${id}/pagar-simulado`, cardData);
    }
}
