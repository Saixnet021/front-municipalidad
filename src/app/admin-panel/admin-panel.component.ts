import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
  tramites: any[] = [];
  loading = true;
  error = '';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadTramites();
  }

  loadTramites() {
    this.loading = true;
    this.http.get<any[]>(`${environment.apiUrl}/admin/tramites`).subscribe({
      next: (data) => {
        this.tramites = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los trámites.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  approve(id: number) {
    if (!confirm('¿Está seguro de aprobar este trámite?')) return;
    this.http.post(`${environment.apiUrl}/admin/tramites/${id}/approve`, {}).subscribe({
      next: () => {
        this.loadTramites();
      },
      error: (err) => alert('Error al aprobar el trámite')
    });
  }

  reject(id: number) {
    if (!confirm('¿Está seguro de rechazar este trámite?')) return;
    this.http.post(`${environment.apiUrl}/admin/tramites/${id}/reject`, {}).subscribe({
      next: () => {
        this.loadTramites();
      },
      error: (err) => alert('Error al rechazar el trámite')
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'APROBADO': return 'bg-green-100 text-green-800';
      case 'RECHAZADO': return 'bg-red-100 text-red-800';
      case 'PENDIENTE': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}
