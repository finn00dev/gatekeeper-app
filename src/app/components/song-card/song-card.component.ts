import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'song-card',
  imports: [
    CardModule,
    CommonModule
  ],
  templateUrl: './song-card.component.html',
  styleUrl: './song-card.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class SongCardComponent {

  @Input() listNo: number;
  @Input() value: number;
  @Input() songName: string;

}
