import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ArtistService } from '../../service/artist/artist.service';
import { CommonModule, DatePipe } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { GameResult } from '../../model/game-result.model';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CardModule } from 'primeng/card';
import { Tier, GAME_TIERS } from '../../model/tier.model';
import { AnalyticsService } from '../../service/analytics/analytics.service';
import { CookieService } from 'ngx-cookie-service';
import { StatisticsService } from '../../service/statistics/statistics.service';
import { Router } from '@angular/router';

@Component({
    selector: 'game-page',
    standalone: true,
    imports: [
        CommonModule,
        InputTextModule,
        FormsModule,
        AutoCompleteModule,
        CardModule,
        DialogModule,
        ButtonModule
    ],
    templateUrl: './game-page.component.html',
    styleUrl: './game-page.component.scss',
    encapsulation: ViewEncapsulation.None
})

export class GamePageComponent implements OnInit {

  dailyArtist: string;

  guessText: string;

  lives = 3;
  currTier: Tier;
  numOfCorrectGuesses = 0;
  guessesUntilNextTier: number;
  endlessMode = false;

  guesses: string[] = [];
  guessResults: number[] = [];

  autoSuggestions: string[];

  modalVisible = false;

  constructor(
    private artistService: ArtistService,
    private analyticsService: AnalyticsService,
    private cookieService: CookieService,
    private statisticsService: StatisticsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    this.artistService.getTodaysArtist(timezone).subscribe((artistName) => {
      this.dailyArtist = artistName;
      this.initGame();
    });
  }

  initGame() {
    this.calculateTier();
  }

  fillAutoComplete(event: any) {
    if (!this.dailyArtist) {
      this.autoSuggestions = [];
      return;
    }
    if (event.query.toLowerCase() != this.dailyArtist.toLowerCase()) {
      this.artistService.getSuggestions(event.query).subscribe((songs) => {
        this.autoSuggestions = songs;
      })
    } else {
      this.autoSuggestions = [];
    }
  }

  guessSong() {
    if (!this.guesses.includes(this.guessText)) {
      this.artistService.checkGuess(this.dailyArtist, this.guessText)
        .subscribe((isCorrect) => {
          if (isCorrect) {
            this.guesses.push(this.guessText);
            this.guessResults.push(1);
            this.numOfCorrectGuesses++;

            if (this.numOfCorrectGuesses == 3) {
              this.analyticsService.userWon();
            }
          } else {
            this.guesses.push(this.guessText);
            this.guessResults.push(0);
            this.lives--;
          }

          this.guessText = "";
          if (!this.endlessMode) {
            this.calculateTier();
          }
          this.validateGameEnd();
        });
    } else {
      this.guessText = "";
      return;
    }
  }

  validateGameEnd() {
    if (this.lives == 0) {
      this.endGame();
    }
  }

  calculateTier() {
    let nextTier;
    for (let i = 0; i < GAME_TIERS.length; i++) {
      if (this.numOfCorrectGuesses < GAME_TIERS[i].value) {
        this.currTier = GAME_TIERS[i-1];
        nextTier = GAME_TIERS[i];
        break;
      } else if (i == GAME_TIERS.length - 1) {
        this.currTier = GAME_TIERS[i];
        this.endlessMode = true;
        this.modalVisible = true;
        break;
      }
    }

    if (nextTier) {
      this.guessesUntilNextTier = nextTier.value - this.numOfCorrectGuesses;
    }
  }

  endGame() {
    const gameResult: GameResult = {
      win: true,
      numberOfCorrectGuesses: this.numOfCorrectGuesses,
      tier: this.currTier
    }

    if (this.numOfCorrectGuesses >= GAME_TIERS[1].value) {
      this.finishGame(gameResult);
    } else {
      gameResult.win = false;
      this.finishGame(gameResult);
    }
  }

  finishGame(result: GameResult): void {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 1);
    expiry.setHours(0, 0, 0, 0);

    if (!this.cookieService.get('todaysResult')) {
      this.cookieService.set('todaysResult', JSON.stringify(result), expiry);
    }

    this.statisticsService.updateStatistics(result);
    this.router.navigate(['/results']);
  }

  clickGiveUp() {
    this.analyticsService.userGaveUp();
    this.endGame();
  }

  showModal(value: boolean) {
    this.modalVisible = value;
  }
}
