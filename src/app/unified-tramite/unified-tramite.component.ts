import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-unified-tramite',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './unified-tramite.component.html',
  styleUrls: ['./unified-tramite.component.css']
})
export class UnifiedTramiteComponent {
  tramiteForm: FormGroup;
  tiposTramite = [
    { id: 'mesa-de-partes', nombre: 'Mesa de Partes Virtual' },
    { id: 'constancia', nombre: 'Constancia de Residencia' },
    { id: 'licencia', nombre: 'Licencia de Funcionamiento' }
  ];
  selectedFile: File | null = null;
  enviando = false;
  mostrarModal = false;
  expedienteGenerado = '';
  error = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.tramiteForm = this.fb.group({
      tipo: ['', Validators.required],
      usuario: ['', Validators.required],
      // Campos comunes/dinámicos
      asunto: [''],
      descripcion: [''],
      direccion: [''],
      tiempoResidencia: [''],
      nombreNegocio: [''],
      giro: [''],
      area: [''],
      zonificacion: ['']
    });

    // Reset validations when type changes
    this.tramiteForm.get('tipo')?.valueChanges.subscribe(tipo => {
      this.updateValidators(tipo);
    });
  }

  updateValidators(tipo: string) {
    // Clear all validators first
    const controls = ['asunto', 'descripcion', 'direccion', 'tiempoResidencia', 'nombreNegocio', 'giro', 'area', 'zonificacion'];
    controls.forEach(control => {
      this.tramiteForm.get(control)?.clearValidators();
      this.tramiteForm.get(control)?.updateValueAndValidity();
    });

    if (tipo === 'mesa-de-partes') {
      this.tramiteForm.get('asunto')?.setValidators(Validators.required);
      this.tramiteForm.get('descripcion')?.setValidators(Validators.required);
    } else if (tipo === 'constancia') {
      this.tramiteForm.get('direccion')?.setValidators(Validators.required);
      this.tramiteForm.get('tiempoResidencia')?.setValidators(Validators.required);
    } else if (tipo === 'licencia') {
      this.tramiteForm.get('nombreNegocio')?.setValidators(Validators.required);
      this.tramiteForm.get('giro')?.setValidators(Validators.required);
      this.tramiteForm.get('area')?.setValidators(Validators.required);
      this.tramiteForm.get('zonificacion')?.setValidators(Validators.required);
    }
    this.tramiteForm.updateValueAndValidity();
  }

  onFileSelect(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  onSubmit() {
    if (this.tramiteForm.invalid) return;

    this.enviando = true;
    this.error = '';
    const tipo = this.tramiteForm.get('tipo')?.value;
    const formData = new FormData();

    formData.append('usuario', this.tramiteForm.get('usuario')?.value);

    let endpoint = '';
    if (tipo === 'mesa-de-partes') {
      endpoint = 'mesa-de-partes';
      formData.append('asunto', this.tramiteForm.get('asunto')?.value);
      formData.append('descripcion', this.tramiteForm.get('descripcion')?.value);
      if (this.selectedFile) {
        formData.append('archivo', this.selectedFile);
      }
    } else if (tipo === 'constancia') {
      endpoint = 'constancia';
      formData.append('direccion', this.tramiteForm.get('direccion')?.value);
      formData.append('tiempoResidencia', this.tramiteForm.get('tiempoResidencia')?.value);
      if (this.selectedFile) {
        formData.append('recibo', this.selectedFile);
      }
    } else if (tipo === 'licencia') {
      endpoint = 'licencia';
    }

    if (tipo === 'licencia') {
      const areaVal = this.tramiteForm.get('area')?.value;
      const body = {
        usuario: this.tramiteForm.get('usuario')?.value,
        nombreNegocio: this.tramiteForm.get('nombreNegocio')?.value,
        giro: this.tramiteForm.get('giro')?.value,
        area: areaVal ? areaVal : 0,
        zonificacion: this.tramiteForm.get('zonificacion')?.value
      };
      this.http.post<any>(`${environment.apiUrl}/tramites/${endpoint}`, body).subscribe({
        next: (res) => this.handleSuccess(res),
        error: (err) => this.handleError(err)
      });
    } else {
      // Handle numeric fields for FormData
      const tiempoResidencia = this.tramiteForm.get('tiempoResidencia')?.value;
      if (tiempoResidencia) {
        formData.append('tiempoResidencia', tiempoResidencia);
      } else if (tipo === 'constancia') {
        formData.append('tiempoResidencia', '0');
      }

      this.http.post<any>(`${environment.apiUrl}/tramites/${endpoint}`, formData).subscribe({
        next: (res) => this.handleSuccess(res),
        error: (err) => this.handleError(err)
      });
    }
  }

  handleSuccess(res: any) {
    this.enviando = false;
    this.mostrarModal = true;
    this.expedienteGenerado = res.tramite.expediente;
    this.tramiteForm.reset();
    this.selectedFile = null;
  }

  handleError(err: any) {
    this.enviando = false;
    this.error = 'Ocurrió un error al procesar su solicitud.';
    console.error(err);
  }

  cerrarModal() {
    this.mostrarModal = false;
  }
}
