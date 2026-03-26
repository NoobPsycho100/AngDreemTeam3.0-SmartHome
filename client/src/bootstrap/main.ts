import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './config';
import { App } from '../layout/app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
