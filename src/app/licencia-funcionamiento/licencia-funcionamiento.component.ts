import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-licencia-funcionamiento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './licencia-funcionamiento.component.html'
})
export class LicenciaFuncionamientoComponent implements OnInit {
  form: FormGroup;
  loading: boolean = false;
  private apiUrl = 'http://localhost:8080/api/v1/tramites';

  constructor(private fb: FormBuilder, private http: HttpClient) {
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
      this.http.post(`${this.apiUrl}/licencia`, this.form.value).subscribe({
        next: (response: any) => {
          this.loading = false;
          this.form.reset();
          this.form.patchValue({ zonificacion: 'COMERCIAL' });
          alert('Trámite de Licencia de Funcionamiento creado exitosamente. ID: ' + response.tramite.id);
        },
        error: (err) => {
          this.loading = false;
          alert('Error al enviar solicitud: ' + (err.error?.error || 'Error desconocido'));
        }
      });
    }
  }
}
