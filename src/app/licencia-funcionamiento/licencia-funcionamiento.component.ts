import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MuniServicesService } from '../services/muni-services.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-licencia-funcionamiento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './licencia-funcionamiento.component.html'
})
export class LicenciaFuncionamientoComponent implements OnInit {
  form: FormGroup;
  loading: boolean = false;
  mostrarModal: boolean = false;
  expedienteGenerado: string = '';

  constructor(
    private fb: FormBuilder,
    private muniService: MuniServicesService,
    private router: Router
  ) {
    this.form = this.fb.group({
      usuario: ['', Validators.required],
      nombreNegocio: ['', Validators.required],
      giro: ['', Validators.required],
      area: ['', [Validators.required, Validators.min(1)]],
      zonificacion: ['COMERCIAL', Validators.required]
    });
  }

  ngOnInit() {
  }

  onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      this.muniService.emitirLicenciaFuncionamiento(this.form.value).subscribe({
        next: (response: any) => {
          this.loading = false;
          this.expedienteGenerado = response.tramite.expediente;
          this.mostrarModal = true;
          this.form.reset();
          this.form.patchValue({ zonificacion: 'COMERCIAL' });
        },
        error: (err) => {
          this.loading = false;
          alert('Error al enviar solicitud: ' + (err.error?.error || 'Error desconocido'));
        }
      });
    }
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.router.navigate(['/estado-tramites']);
  }
}
