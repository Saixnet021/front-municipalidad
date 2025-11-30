import { Routes } from '@angular/router';
import { LoginComponent } from './modules/auth/login/login.component';
import { RegisterComponent } from './modules/auth/register/register.component';
import { MesaDePartesComponent } from './mesa-de-partes/mesa-de-partes.component';
import { ConstanciaResidenciaComponent } from './constancia-residencia/constancia-residencia.component';
import { LicenciaFuncionamientoComponent } from './licencia-funcionamiento/licencia-funcionamiento.component';
import { PagoArbitriosComponent } from './pago-arbitrios/pago-arbitrios.component';
import { AuthGuard } from './guards/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SobreElDistritoComponent } from './modules/public/sobre-el-distrito/sobre-el-distrito.component';
import { TramitesDashboardComponent } from './tramites-dashboard/tramites-dashboard.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'sobre-el-distrito', component: SobreElDistritoComponent },
  { path: 'tramites', component: TramitesDashboardComponent },
  { path: 'mesa-de-partes', component: MesaDePartesComponent },
  { path: 'constancia-residencia', component: ConstanciaResidenciaComponent },
  { path: 'licencia-funcionamiento', component: LicenciaFuncionamientoComponent },
  { path: 'pago-arbitrios', component: PagoArbitriosComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
];
