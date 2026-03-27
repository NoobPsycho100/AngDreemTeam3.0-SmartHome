import { Routes } from '@angular/router';
import { EmptyPage } from '../pages/empty';
import { DashboardPage } from '../pages/dashboard';
import { RoomsPage } from '../pages/rooms';
import { DevicesPage } from '../pages/devices';
import { ScenesPage } from '../pages/scenes';
import { AutomationPage } from '../pages/automation';
import { EnergyPage } from '../pages/energy';
import { SettingsPage } from '../pages/settings';
import { authPermissionsGuardFactory } from './route-guards/auth-permissions-guard';

export const routes: Routes = [
  {
    path: '',
    component: EmptyPage,
    title: 'Welcome to Smart.Home!'
  },
  {
    path: 'dashboard',
    component: DashboardPage,
    title: 'Smart.Home Dashboard',
    canActivate: [authPermissionsGuardFactory('Dashboard')],
  },
  {
    path: 'rooms',
    component: RoomsPage,
    title: 'Smart.Home Rooms',
    canActivate: [authPermissionsGuardFactory('RoomsView')],
  },
  {
    path: 'devices',
    component: DevicesPage,
    title: 'Smart.Home Devices',
    canActivate: [authPermissionsGuardFactory('DevicesView')],
  },
  {
    path: 'scenes',
    component: ScenesPage,
    title: 'Smart.Home Scenes',
    canActivate: [authPermissionsGuardFactory('ScenesView')],
  },
  {
    path: 'automation',
    component: AutomationPage,
    title: 'Smart.Home Automation',
    canActivate: [authPermissionsGuardFactory('Automation')],
  },
  {
    path: 'energy',
    component: EnergyPage,
    title: 'Smart.Home Energy',
    canActivate: [authPermissionsGuardFactory('Energy')],
  },
  {
    path: 'settings',
    component: SettingsPage,
    title: 'Smart.Home Admin Panel',
    canActivate: [authPermissionsGuardFactory('AdminPanel')],
  },
];