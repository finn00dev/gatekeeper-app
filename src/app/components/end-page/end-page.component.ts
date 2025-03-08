import { Component, Input, OnInit } from '@angular/core';
import { GameResult } from '../../model/game-result.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'end-page',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './end-page.component.html',
  styleUrl: './end-page.component.scss'
})
export class EndPageComponent implements OnInit {

  @Input('result') result: GameResult;

  ngOnInit(): void {
    console.log(this.result);
  }
}
