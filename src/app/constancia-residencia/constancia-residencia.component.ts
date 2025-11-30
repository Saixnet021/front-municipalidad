import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

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
  private apiUrl = 'http://localhost:8080/api/v1/tramites';

  constructor(private fb: FormBuilder, private http: HttpClient) {
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

      this.http.post(`${this.apiUrl}/constancia`, formData).subscribe({
        next: (response: any) => {
          this.loading = false;
          this.form.reset();
          this.selectedFile = null;
          alert('Trámite de Constancia de Residencia creado exitosamente. ID: ' + response.tramite.id);
        },
        error: (err) => {
          this.loading = false;
          alert('Error al enviar solicitud: ' + (err.error?.error || 'Error desconocido'));
        }
      });
    }
  }
}
