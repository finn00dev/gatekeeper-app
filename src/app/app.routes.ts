import { Routes } from '@angular/router';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { StartPageComponent } from './components/start-page/start-page.component';
import { GamePageComponent } from './components/game-page/game-page.component';
import { EndPageComponent } from './components/end-page/end-page.component';
import { HowToPageComponent } from './components/how-to-page/how-to-page.component';
import { dailyGameGuard } from './guards/daily-game.guard';
import { resultsGuard } from './guards/results.guard';

export const routes: Routes = [
    {
        path: '',
        component: StartPageComponent
    },
    {
        path: 'how-to',
        component: HowToPageComponent
    },
    {
        path: 'daily',
        component: GamePageComponent,
        canActivate: [dailyGameGuard]
    },
    {
        path: 'results',
        component: EndPageComponent,
        canActivate: [resultsGuard]
    },
    {
        path: 'error',
        component: ErrorPageComponent
    },
];
