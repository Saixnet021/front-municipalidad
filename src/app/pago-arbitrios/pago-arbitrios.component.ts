import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PagoService } from '../services/pago.service';
import { environment } from '../../environments/environment';

declare var Culqi: any;

@Component({
  selector: 'app-pago-arbitrios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pago-arbitrios.component.html',
  styleUrls: ['./pago-arbitrios.component.css']
})
export class PagoArbitriosComponent implements OnInit {
  dni: string = '';
  items: any[] = [];
  loading: boolean = false;
  error: string = '';
  selectedItem: any = null;

  constructor(
    private pagoService: PagoService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit() {
  }

  consultarDeuda() {
    if (!this.dni || this.dni.length !== 8) {
      this.error = 'Por favor ingrese un DNI válido de 8 dígitos.';
      return;
    }

    this.loading = true;
    this.error = '';
    this.items = [];

    this.pagoService.consultarDeudas(this.dni).subscribe({
      next: (data) => {
        this.items = data;
        this.loading = false;
        if (this.items.length === 0) {
          this.error = 'No se encontraron deudas pendientes para este DNI.';
        }
      },
      error: (err) => {
        console.error(err);
        this.error = 'Error al consultar las deudas. Intente nuevamente.';
        this.loading = false;
      }
    });
  }

  pay(item: any) {
    // Simulación de pago directo por ahora, ya que se removió Culqi
    if (confirm('¿Desea procesar el pago de ' + item.monto + ' soles?')) {
      this.procesarPagoBackend('token_simulado', 'usuario@example.com');
    }
  }

  procesarPagoBackend(token: string, email: string) {
    if (!this.selectedItem) this.selectedItem = this.items.find(i => i.id === this.items[0].id); // Fallback simple

    const pagoRequest = {
      token: token,
      deudaId: this.selectedItem?.id,
      email: email,
      monto: this.selectedItem?.monto
    };

    this.loading = true;

    this.pagoService.procesarPago(pagoRequest).subscribe({
      next: (resp) => {
        alert('¡Pago realizado con éxito! ID Transacción: ' + resp.pago.idPago);
        this.loading = false;
        this.selectedItem = null;
        this.consultarDeuda(); // Recargar lista
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        alert('Error al procesar el pago en el servidor: ' + (err.error?.error || 'Error desconocido'));
      }
    });
  }

  cargarDemo() {
    this.dni = '12345678';
    this.consultarDeuda();
  }


}
