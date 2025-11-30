import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-tramites-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tramites-dashboard.component.html',
  styleUrls: ['./tramites-dashboard.component.css']
})
export class TramitesDashboardComponent {
  tramites = [
    {
      title: 'Mesa de Partes',
      description: 'Presenta solicitudes, quejas y reclamos de manera digital',
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      route: '/mesa-de-partes',
      color: 'blue'
    },
    {
      title: 'Constancia de Residencia',
      description: 'Solicita tu constancia de domicilio de forma rápida',
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
      route: '/constancia-residencia',
      color: 'green'
    },
    {
      title: 'Licencia de Funcionamiento',
      description: 'Tramita la licencia para tu negocio o establecimiento',
      icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
      route: '/licencia-funcionamiento',
      color: 'purple'
    }
  ];
}
