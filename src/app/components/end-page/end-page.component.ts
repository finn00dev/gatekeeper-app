import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { GameResult } from '../../model/game-result.model';
import { CommonModule, DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'end-page',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
  ],
  templateUrl: './end-page.component.html',
  styleUrl: './end-page.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class EndPageComponent implements OnInit {

  @Input('result') result: GameResult;
  guessValues: number[];
  numOfCorrectGuesses: number;

  guessEmojis: string = '';
  currentDate: string = '';

  constructor(
    private datePipe: DatePipe,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.guessValues = this.result.guessResults;
    this.numOfCorrectGuesses = this.guessValues.reduce(function (acc, cur) { return acc + cur; });
    this.buildEmojiScore();
    this.buildCurrentDate();
    this.storeCookie();
  }

  buildEmojiScore() {
    this.guessEmojis = '';
    console.log(this.guessValues);
    this.guessValues.forEach((value) => {
      if (value == 1) {
        this.guessEmojis += "✅ "
      } else if (value == 0) {
        this.guessEmojis += "❌ "
      }
    });
  }

  buildCurrentDate() {
		const date = new Date();
		this.currentDate = this.datePipe.transform(date, 'yyyy-MM-dd') || '';
  }

  storeCookie() {
    if (!this.cookieService.get('todaysResult')) {
      let expiry = new Date();
      expiry.setDate(expiry.getDate() + 1);
      expiry.setHours(0,0,0,0);
      this.cookieService.set('todaysResult', JSON.stringify(this.result), expiry);
    }
  }
}
