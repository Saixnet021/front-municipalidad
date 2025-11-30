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
    if (isPlatformBrowser(this.platformId)) {
      // Configuración inicial de Culqi solo en el navegador
      if (typeof Culqi !== 'undefined') {
        Culqi.publicKey = environment.culqiPublicKey;
        Culqi.options({
          style: {
            logo: 'https://static.culqi.com/v2/v2/static/img/logo.png', // Reemplazar con logo municipal si existe
            maincolor: '#2563eb' // blue-600
          }
        });

        // Asignar callback global
        (window as any).culqi = this.culqiCallback.bind(this);
      } else {
        console.warn('Culqi script not loaded yet.');
      }
    }
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
    this.selectedItem = item;

    // Configurar settings con el monto dinámico
    const montoCentimos = Math.round(item.monto * 100);

    Culqi.settings({
      title: 'Municipalidad Distrital de Santiago de Ica',
      currency: 'PEN',
      description: item.tipo + ' - ' + item.periodo,
      amount: montoCentimos
    });

    Culqi.open();
  }

  culqiCallback() {
    if (Culqi.token) {
      const token = Culqi.token.id;
      const email = Culqi.token.email;

      console.log('Token generado:', token);

      this.procesarPagoBackend(token, email);

    } else if (Culqi.error) {
      // Error en el proceso de pago
      console.error(Culqi.error);
      alert('Error en el pago: ' + Culqi.error.user_message);
    }
  }

  procesarPagoBackend(token: string, email: string) {
    if (!this.selectedItem) return;

    const pagoRequest = {
      token: token,
      deudaId: this.selectedItem.id,
      email: email,
      monto: this.selectedItem.monto
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

  // --- MODO DEV: Simulación de Pago ---
  simularPago(item: any) {
    this.selectedItem = item;

    // Simular objeto Culqi
    if (typeof Culqi === 'undefined') {
      (window as any).Culqi = {};
    }

    Culqi.token = {
      id: "tkn_test_simulado_" + Math.random().toString(36).substring(7),
      email: "dev_test@municipalidad.gob.pe"
    };

    console.log('DEV MODE: Simulando respuesta de Culqi con token:', Culqi.token.id);
    this.culqiCallback();
  }

  cargarDemo() {
    this.dni = '12345678';
    this.consultarDeuda();
  }
}
