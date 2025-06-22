import { Routes } from '@angular/router';
import { GameRootComponent } from './components/game-root/game-root.component';
import { ErrorPageComponent } from './components/error-page/error-page.component';

export const routes: Routes = [
    {
        path: '',
        component: GameRootComponent
    },
    {
        path: 'error',
        component: ErrorPageComponent
    },
];
