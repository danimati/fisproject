import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { DemoComponent } from './pages/demo/demo.component';
import { VesselManagementSimpleComponent } from './pages/vessel-management-simple/vessel-management-simple.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'demo', component: DemoComponent },
  { path: 'vessels', component: VesselManagementSimpleComponent },
  { path: 'dashboard', component: HomeComponent },
  { path: '**', redirectTo: '' }
];
