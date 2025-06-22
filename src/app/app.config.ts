import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import Aura from '@primeng/themes/aura';

import { initializeApp } from "firebase/app";
import { provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideHttpClient(), 
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
          preset: Aura,
          options: {
            darkModeSelector: false
          }
      }
    }),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    DatePipe
  ]
};
