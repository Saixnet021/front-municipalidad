import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MuniServicesService } from '../services/muni-services.service';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface TramiteStatus {
  id: number;
  expediente: string;
  usuario: string;
  fecha: string;
  estado: string;
  tipo: string;
  asunto?: string;
  direccion?: string;
  nombreNegocio?: string;
}

interface TimelineStep {
  name: string;
  status: 'completed' | 'current' | 'pending';
  date?: string;
}

@Component({
  selector: 'app-estado-tramites',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './estado-tramites.component.html',
  styleUrls: ['./estado-tramites.component.css']
})
export class EstadoTramitesComponent {
  activeTab: 'expediente' | 'dni' = 'expediente';
  searchValue: string = '';
  tramiteEncontrado: TramiteStatus | null = null;
  buscando: boolean = false;
  errorBusqueda: string = '';

  constructor(private muniService: MuniServicesService) { }

  cambiarTab(tab: 'expediente' | 'dni') {
    this.activeTab = tab;
    this.searchValue = '';
    this.tramiteEncontrado = null;
    this.errorBusqueda = '';
  }

  buscarTramite() {
    if (!this.searchValue.trim()) {
      return;
    }

    this.buscando = true;
    this.errorBusqueda = '';
    this.tramiteEncontrado = null;

    if (this.activeTab === 'expediente') {
      this.muniService.buscarTramitePorExpediente(this.searchValue).subscribe({
        next: (response) => {
          this.tramiteEncontrado = this.procesarTramite(response);
          this.buscando = false;
        },
        error: (error) => {
          this.errorBusqueda = 'No se encontró el trámite';
          this.buscando = false;
        }
      });
    } else {
      // Búsqueda por DNI - retorna lista de trámites
      this.muniService.buscarTramitesPorUsuario(this.searchValue).subscribe({
        next: (response) => {
          if (response && response.length > 0) {
            this.tramiteEncontrado = this.procesarTramite(response[0]);
          } else {
            this.errorBusqueda = 'No se encontraron trámites para este DNI';
          }
          this.buscando = false;
        },
        error: (error) => {
          this.errorBusqueda = 'Error al buscar trámites';
          this.buscando = false;
        }
      });
    }
  }

  procesarTramite(data: any): TramiteStatus {
    // Determinar el tipo de trámite basado en las propiedades
    let tipo = 'Trámite General';
    if (data.asunto) {
      tipo = 'Mesa de Partes';
    } else if (data.direccion) {
      tipo = 'Constancia de Residencia';
    } else if (data.nombreNegocio) {
      tipo = 'Licencia de Funcionamiento';
    }

    return {
      id: data.id,
      expediente: data.expediente,
      usuario: data.usuario,
      fecha: data.fecha,
      estado: data.estado,
      tipo: tipo,
      asunto: data.asunto,
      direccion: data.direccion,
      nombreNegocio: data.nombreNegocio
    };
  }

  getTimeline(): TimelineStep[] {
    if (!this.tramiteEncontrado) return [];

    const estado = this.tramiteEncontrado.estado;

    const steps: TimelineStep[] = [
      { name: 'Recepción de documentos', status: 'completed', date: this.formatDate(this.tramiteEncontrado.fecha) },
      { name: 'Revisión técnica', status: 'pending' },
      { name: 'Inspección ocular', status: 'pending' },
      { name: 'Emisión de resolución', status: 'pending' },
      { name: 'Entrega de licencia', status: 'pending' }
    ];

    if (estado === 'EN_PROCESO') {
      steps[1].status = 'current';
      steps[1].date = this.getRecentDate(1);
    } else if (estado === 'APROBADO') {
      steps[1].status = 'completed';
      steps[1].date = this.getRecentDate(2);
      steps[2].status = 'completed';
      steps[2].date = this.getRecentDate(1);
      steps[3].status = 'current';
    } else if (estado === 'RECHAZADO') {
      steps[1].status = 'completed';
      steps[1].date = this.getRecentDate(1);
      steps[2].status = 'current';
    }

    return steps;
  }

  getProgressPercentage(): number {
    if (!this.tramiteEncontrado) return 0;

    const estado = this.tramiteEncontrado.estado;
    switch (estado) {
      case 'PENDIENTE': return 20;
      case 'EN_PROCESO': return 60;
      case 'APROBADO': return 100;
      case 'RECHAZADO': return 40;
      default: return 0;
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }

  getRecentDate(daysAgo: number): string {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return this.formatDate(date.toISOString());
  }

  getTipoTramiteBadgeClass(): string {
    if (!this.tramiteEncontrado) return '';

    switch (this.tramiteEncontrado.tipo) {
      case 'Mesa de Partes': return 'badge-blue';
      case 'Constancia de Residencia': return 'badge-green';
      case 'Licencia de Funcionamiento': return 'badge-purple';
      default: return 'badge-gray';
    }
  }

  getEstadoLabel(): string {
    if (!this.tramiteEncontrado) return '';

    switch (this.tramiteEncontrado.estado) {
      case 'PENDIENTE': return 'Pendiente';
      case 'EN_PROCESO': return 'En Proceso';
      case 'APROBADO': return 'Aprobado';
      case 'RECHAZADO': return 'Rechazado';
      default: return this.tramiteEncontrado.estado;
    }
  }

  descargarPDF() {
    if (!this.tramiteEncontrado) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header con logo y título
    doc.setFillColor(200, 16, 46); // Color rojo de la municipalidad
    doc.rect(0, 0, pageWidth, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Municipalidad Distrital de Santiago', pageWidth / 2, 15, { align: 'center' });

    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('Estado de Trámite', pageWidth / 2, 25, { align: 'center' });

    doc.setFontSize(10);
    doc.text('Santiago - Ica', pageWidth / 2, 32, { align: 'center' });

    // Información del trámite
    doc.setTextColor(0, 0, 0);
    let yPos = 55;

    // Título del documento
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(this.tramiteEncontrado.tipo, 20, yPos);
    yPos += 10;

    // Badge de estado
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    const estadoLabel = this.getEstadoLabel();
    doc.setFillColor(220, 220, 220);
    doc.roundedRect(20, yPos - 5, 30, 8, 2, 2, 'F');
    doc.text(estadoLabel, 35, yPos, { align: 'center' });
    yPos += 15;

    // Detalles del trámite
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');

    const details = [
      ['Expediente:', this.tramiteEncontrado.expediente],
      ['Solicitante:', this.tramiteEncontrado.usuario],
      ['Fecha de Inicio:', this.formatDate(this.tramiteEncontrado.fecha)],
      ['Estado:', estadoLabel],
      ['Progreso:', `${this.getProgressPercentage()}%`]
    ];

    details.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold');
      doc.text(label, 20, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(value, 70, yPos);
      yPos += 8;
    });

    yPos += 5;

    // Seguimiento del proceso
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Seguimiento del Proceso', 20, yPos);
    yPos += 10;

    const timeline = this.getTimeline();
    timeline.forEach((step, index) => {
      doc.setFontSize(10);

      // Icono de estado
      if (step.status === 'completed') {
        doc.setFillColor(34, 197, 94); // Verde
        doc.circle(25, yPos - 2, 3, 'F');
      } else if (step.status === 'current') {
        doc.setFillColor(59, 130, 246); // Azul
        doc.circle(25, yPos - 2, 3, 'F');
      } else {
        doc.setFillColor(203, 213, 225); // Gris
        doc.circle(25, yPos - 2, 2, 'F');
      }

      // Línea conectora (excepto el último)
      if (index < timeline.length - 1) {
        doc.setDrawColor(203, 213, 225);
        doc.line(25, yPos + 1, 25, yPos + 8);
      }

      // Nombre del paso
      doc.setFont('helvetica', 'bold');
      if (step.status === 'completed') {
        doc.setTextColor(22, 163, 74);
      } else if (step.status === 'current') {
        doc.setTextColor(37, 99, 235);
      } else {
        doc.setTextColor(148, 163, 184);
      }
      doc.text(step.name, 35, yPos);

      // Fecha
      if (step.date) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text(step.date, 35, yPos + 4);
      } else {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text('Pendiente', 35, yPos + 4);
      }

      doc.setTextColor(0, 0, 0);
      yPos += 12;
    });

    // Footer
    yPos = doc.internal.pageSize.getHeight() - 20;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('Jr. Callao 135, Santiago - Ica, Perú', pageWidth / 2, yPos, { align: 'center' });
    doc.text('Central: (056) 123-4567 | contacto@munisantiago.gob.pe', pageWidth / 2, yPos + 4, { align: 'center' });
    doc.text(`Documento generado el ${new Date().toLocaleDateString('es-PE')}`, pageWidth / 2, yPos + 8, { align: 'center' });

    // Guardar PDF
    doc.save(`Tramite_${this.tramiteEncontrado.expediente}.pdf`);
  }
}
