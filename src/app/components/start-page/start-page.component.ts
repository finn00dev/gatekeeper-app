import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'start-page',
  imports: [
    ButtonModule
  ],
  templateUrl: './start-page.component.html',
  styleUrl: './start-page.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class StartPageComponent {

  @Input() dailyArtist: string;
  @Output() startGame = new EventEmitter<number>();

  clickStart() {
    this.startGame.emit(1);
  }

}
