import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { 
    path: 'login', 
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    loadComponent: () => import('./components/layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      { 
        path: '', 
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      { 
        path: 'dashboard', 
        loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      { 
        path: 'users', 
        loadComponent: () => import('./components/users/users.component').then(m => m.UsersComponent)
      },
      { 
        path: 'users/register', 
        loadComponent: () => import('./components/users/register-user/register-user.component').then(m => m.RegisterUserComponent)
      },
      { 
        path: 'security', 
        loadComponent: () => import('./components/security/security.component').then(m => m.SecurityComponent)
      },
      { 
        path: 'audit', 
        loadComponent: () => import('./components/audit/audit.component').then(m => m.AuditComponent)
      },
      { 
        path: 'roles', 
        loadComponent: () => import('./components/roles/roles.component').then(m => m.RolesComponent)
      },
      { 
        path: 'performance', 
        loadComponent: () => import('./components/performance/performance.component').then(m => m.PerformanceComponent)
      },
      { 
        path: 'settings', 
        loadComponent: () => import('./components/settings/settings.component').then(m => m.SettingsComponent)
      }
    ]
  },
  { path: '**', redirectTo: '/login' }
];
