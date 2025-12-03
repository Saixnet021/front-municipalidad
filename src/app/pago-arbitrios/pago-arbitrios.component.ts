import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PagoService } from '../services/pago.service';
import { environment } from '../../environments/environment';

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
  showPaymentForm = false;

  cardData = {
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    ownerName: ''
  };

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

  iniciarPago(item: any) {
    this.selectedItem = item;
    this.showPaymentForm = true;
  }

  cancelarPago() {
    this.showPaymentForm = false;
    this.selectedItem = null;
    this.cardData = { cardNumber: '', expiryDate: '', cvv: '', ownerName: '' };
  }

  procesarPagoSimulado() {
    if (!this.selectedItem) return;

    this.pagoService.realizarPagoSimulado(this.selectedItem.id, this.cardData).subscribe({
      next: () => {
        alert('Pago realizado con éxito');
        this.cancelarPago();
        this.consultarDeuda(); // Refresh debts
      },
      error: (err) => {
        console.error('Error al procesar el pago', err);
        alert('Error al procesar el pago');
      }
    });
  }

  cargarDemo() {
    this.dni = '12345678';
    this.consultarDeuda();
  }
}
