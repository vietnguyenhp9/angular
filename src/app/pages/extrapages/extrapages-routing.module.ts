import { Routes } from '@angular/router';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { Page404Component } from './page404/page404.component';
import { Page500Component } from './page500/page500.component';

export const extrapagesRoutes: Routes = [
    {
        path: 'maintenance',
        component: MaintenanceComponent,

    },
    {
        path: '404',
        component: Page404Component
    },
    {
        path: '500',
        component: Page500Component
    },
];

