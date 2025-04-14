import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ArtistService } from '../../service/artist/artist.service';
import { Artist } from '../../model/artist.model';
import { CommonModule, DatePipe } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { GameResult } from '../../model/game-result.model';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CardModule } from 'primeng/card';
import { Tier, GAME_TIERS } from '../../model/tier.model';

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

  @Input() dailyArtist: Artist;
  @Output() gameEnd = new EventEmitter<GameResult>();

  artistSongs: string[];

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
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.initGame();
  }

  initGame() {
    this.getSongList();
    this.calculateTier();
  }

  getSongList() {
    this.artistService.getTopSongs(this.dailyArtist.name)
      .subscribe((songs) => {
        this.artistSongs = songs;
      });
  }

  fillAutoComplete(event: any) {
    if (event.query.toLowerCase() != this.dailyArtist.name.toLowerCase()) {
      this.artistService.searchSongs(event.query).subscribe((songs) => {
        this.autoSuggestions = songs;
      })
    } else {
      this.autoSuggestions = [];
    }
  }

  guessSong() {
    const song = this.artistSongs.find((song) => song == this.guessText);

    if (!this.guesses.includes(this.guessText)) {
      // Correct Guess
      if (song) {
        this.guesses.push(song);
        this.guessResults.push(1);
        this.numOfCorrectGuesses++;
      // Incorrect Guess
      } else {
        this.guesses.push(this.guessText);
        this.guessResults.push(0);
        this.lives--;
      }
    } else {
      this.guessText = "";
      return;
    }

    this.guessText = "";
    if (!this.endlessMode) {
      this.calculateTier();
    }
    this.validateGameEnd();
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
      this.gameEnd.emit(gameResult);
    } else {
      gameResult.win = false;
      this.gameEnd.emit(gameResult);
    }
  }

  showModal(value: boolean) {
    this.modalVisible = value;
  }
}
