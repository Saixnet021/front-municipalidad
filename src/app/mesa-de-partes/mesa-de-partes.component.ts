import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MuniServicesService } from '../services/muni-services.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mesa-de-partes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './mesa-de-partes.component.html'
})
export class MesaDePartesComponent implements OnInit {
  tramiteForm: FormGroup;
  selectedFile: File | null = null;
  enviando: boolean = false;
  mensajeExito: string = '';
  expedienteGenerado: string = '';
  mostrarModal: boolean = false;

  constructor(
    private fb: FormBuilder,
    private muniService: MuniServicesService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.tramiteForm = this.fb.group({
      usuario: ['', Validators.required],
      asunto: ['', Validators.required],
      descripcion: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Initialization if needed
  }

  onFileSelect(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  onSubmit() {
    if (this.tramiteForm.valid) {
      this.enviando = true;
      const formData = new FormData();
      formData.append('usuario', this.tramiteForm.get('usuario')?.value);
      formData.append('asunto', this.tramiteForm.get('asunto')?.value);
      formData.append('descripcion', this.tramiteForm.get('descripcion')?.value);
      if (this.selectedFile) {
        formData.append('archivo', this.selectedFile);
      }

      this.muniService.crearMesaDePartes(formData).subscribe({
        next: (response) => {
          this.enviando = false;
          this.expedienteGenerado = response.tramite.expediente;
          this.mostrarModal = true;
          this.tramiteForm.reset();
          this.selectedFile = null;
        },
        error: (err) => {
          this.enviando = false;
          alert('Error al enviar trámite: ' + (err.error?.error || 'Error desconocido'));
        }
      });
    }
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.router.navigate(['/estado-tramites']);
  }
}
