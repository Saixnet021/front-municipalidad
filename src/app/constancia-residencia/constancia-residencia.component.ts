import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MuniServicesService } from '../services/muni-services.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-constancia-residencia',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './constancia-residencia.component.html'
})
export class ConstanciaResidenciaComponent implements OnInit {
  form: FormGroup;
  selectedFile: File | null = null;
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
      direccion: ['', Validators.required],
      tiempoResidencia: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit() {
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      const formData = new FormData();
      formData.append('usuario', this.form.value.usuario);
      formData.append('direccion', this.form.value.direccion);
      formData.append('tiempoResidencia', this.form.value.tiempoResidencia);

      if (this.selectedFile) {
        formData.append('recibo', this.selectedFile);
      }

      this.muniService.solicitarConstanciaResidencia(formData).subscribe({
        next: (response: any) => {
          this.loading = false;
          this.expedienteGenerado = response.tramite.expediente;
          this.mostrarModal = true;
          this.form.reset();
          this.selectedFile = null;
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
