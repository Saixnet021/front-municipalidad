import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-mesa-de-partes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './mesa-de-partes.component.html'
})
export class MesaDePartesComponent implements OnInit {
  tramiteForm: FormGroup;
  tramites: any[] = [];
  selectedFile: File | null = null;
  private apiUrl = 'http://localhost:8080/api/v1/mesa-partes';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.tramiteForm = this.fb.group({
      asunto: ['', Validators.required],
      descripcion: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadTramites();
  }

  loadTramites() {
    this.http.get<any[]>(`${this.apiUrl}/mis-tramites`).subscribe({
      next: (data) => this.tramites = data,
      error: (err) => console.error(err)
    });
  }

  onFileSelect(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  onSubmit() {
    if (this.tramiteForm.valid) {
      const formData = new FormData();
      formData.append('asunto', this.tramiteForm.get('asunto')?.value);
      formData.append('descripcion', this.tramiteForm.get('descripcion')?.value);
      if (this.selectedFile) {
        formData.append('archivo', this.selectedFile);
      }

      this.http.post(this.apiUrl, formData).subscribe({
        next: () => {
          this.tramiteForm.reset();
          this.selectedFile = null;
          this.loadTramites();
          alert('Trámite enviado con éxito');
        },
        error: (err) => alert('Error al enviar trámite')
      });
    }
  }
}
