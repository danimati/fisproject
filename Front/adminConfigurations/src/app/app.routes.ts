import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { erpAuthGuard } from './erp/erp-auth.guard';
import { ENTITY_KEYS, EntityKey } from './erp/erp-config';

const loadLegacyLogin = () => import('./components/login/login.component').then((m) => m.LoginComponent);
const loadLegacyLayout = () => import('./components/layout/layout.component').then((m) => m.LayoutComponent);
const loadLegacyDashboard = () => import('./components/dashboard/dashboard.component').then((m) => m.DashboardComponent);
const loadLegacyUsers = () => import('./components/users/users.component').then((m) => m.UsersComponent);
const loadLegacySecurity = () => import('./components/security/security.component').then((m) => m.SecurityComponent);
const loadLegacyAudit = () => import('./components/audit/audit.component').then((m) => m.AuditComponent);
const loadLegacyRoles = () => import('./components/roles/roles.component').then((m) => m.RolesComponent);
const loadLegacyPerformance = () => import('./components/performance/performance.component').then((m) => m.PerformanceComponent);
const loadLegacySettings = () => import('./components/settings/settings.component').then((m) => m.SettingsComponent);
const loadLegacyBranchAccess = () => import('./components/branch-access/branch-access.component').then((m) => m.BranchAccessComponent);
const loadLegacyClientDirectory = () => import('./components/client-directory/client-directory.component').then((m) => m.ClientDirectoryComponent);
const loadLegacyContainerInventory = () => import('./components/container-inventory/container-inventory.component').then((m) => m.ContainerInventoryComponent);
const loadLegacyShipmentTraceability = () => import('./components/shipment-traceability/shipment-traceability.component').then((m) => m.ShipmentTraceabilityComponent);
const loadLegacyMaritimeDashboard = () => import('./components/maritime-dashboard/maritime-dashboard.component').then((m) => m.MaritimeDashboardComponent);
const loadLegacyVesselFleet = () => import('./components/vessel-fleet/vessel-fleet.component').then((m) => m.VesselFleetComponent);

const loadErpLogin = () => import('./erp/erp-login.component').then((m) => m.ErpLoginComponent);
const loadErpLayout = () => import('./erp/erp-layout.component').then((m) => m.ErpLayoutComponent);
const loadErpDashboard = () => import('./erp/erp-dashboard.component').then((m) => m.ErpDashboardComponent);
const loadErpEntityPage = () => import('./erp/erp-entity-page.component').then((m) => m.ErpEntityPageComponent);

function buildErpEntityRoutes(entityKey: EntityKey): Routes {
  return [
    { path: entityKey, loadComponent: loadErpEntityPage, data: { entityKey, mode: 'list' } },
    { path: `${entityKey}/new`, loadComponent: loadErpEntityPage, data: { entityKey, mode: 'create' } },
    { path: `${entityKey}/:id/edit`, loadComponent: loadErpEntityPage, data: { entityKey, mode: 'edit' } },
    { path: `${entityKey}/:id`, loadComponent: loadErpEntityPage, data: { entityKey, mode: 'detail' } }
  ];
}

export const routes: Routes = [
  { path: 'login', loadComponent: loadLegacyLogin },
  {
    path: '',
    loadComponent: loadLegacyLayout,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: loadLegacyDashboard },
      { path: 'users', loadComponent: loadLegacyUsers },
      { path: 'security', loadComponent: loadLegacySecurity },
      { path: 'audit', loadComponent: loadLegacyAudit },
      { path: 'roles', loadComponent: loadLegacyRoles },
      { path: 'performance', loadComponent: loadLegacyPerformance },
      { path: 'settings', loadComponent: loadLegacySettings },
      { path: 'branch-access', loadComponent: loadLegacyBranchAccess },
      { path: 'client-directory', loadComponent: loadLegacyClientDirectory },
      { path: 'container-inventory', loadComponent: loadLegacyContainerInventory },
      { path: 'shipment-traceability', loadComponent: loadLegacyShipmentTraceability },
      { path: 'maritime-dashboard', loadComponent: loadLegacyMaritimeDashboard },
      { path: 'vessel-fleet', loadComponent: loadLegacyVesselFleet }
    ]
  },
  {
    path: 'erp',
    children: [
      { path: 'login', loadComponent: loadErpLogin },
      {
        path: '',
        loadComponent: loadErpLayout,
        canActivate: [erpAuthGuard],
        children: [
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
          { path: 'dashboard', loadComponent: loadErpDashboard },
          ...ENTITY_KEYS.flatMap((entityKey) => buildErpEntityRoutes(entityKey))
        ]
      },
      { path: '**', redirectTo: 'login' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
