import { Component } from '@angular/core';
import { GameRootComponent } from './components/game-root/game-root.component';

@Component({
    selector: 'app-root',
    imports: [
        GameRootComponent
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'gatekeeper-app';
}
