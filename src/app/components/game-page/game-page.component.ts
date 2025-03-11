import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ArtistService } from '../../service/artist/artist.service';
import { Artist } from '../../model/artist.model';
import { CommonModule, DatePipe } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { GameResult } from '../../model/game-result.model';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CardModule } from 'primeng/card';
import { SongCardComponent } from '../song-card/song-card.component';

@Component({
    selector: 'game-page',
    standalone: true,
    imports: [
        CommonModule,
        InputTextModule,
        FormsModule,
        AutoCompleteModule,
        CardModule,
        SongCardComponent
    ],
    templateUrl: './game-page.component.html',
    styleUrl: './game-page.component.scss',
    encapsulation: ViewEncapsulation.None
})

export class GamePageComponent implements OnInit {

  @Input() dailyArtist: Artist;
  @Output() gameEnd = new EventEmitter<GameResult>();

  MAX_GUESSES = 5;
  NUM_TO_WIN = 3;

  artistSongs: string[];

  guessText: string;
  currentGuess = 0;
  guesses: string[] = [];
  guessResults: number[] = [-1, -1, -1, -1, -1];
  guessEmojis: string = '';

  autoSuggestions: string[];

  constructor(
    private artistService: ArtistService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.initGame();
    this.buildGuessEmojis();
  }

  initGame() {
    this.getSongList();
  }

  getSongList() {
    this.artistService.getTopSongs(this.dailyArtist.name)
      .subscribe((songs) => {
        this.artistSongs = songs;
      });
  }

  fillAutoComplete(event: any) {
    this.artistService.searchSongs(event.query).subscribe((songs) => {
      this.autoSuggestions = songs;
    })
  }

  guessSong() {
    const song = this.artistSongs.find((song) => song == this.guessText);

    if (song) {
      this.guesses.push(song);
      this.guessResults[this.currentGuess] = 1;
    } else {
      this.guesses.push(this.guessText);
      this.guessResults[this.currentGuess] = 0;
    }

    console.log(this.guessResults);

    this.guessText = "";
    this.currentGuess++;
    this.buildGuessEmojis();
    this.validateGameEnd();
  }

  buildGuessEmojis() {
    this.guessEmojis = '';
    for (let i = 0; i < 5; i++) {
      if (this.guessResults[i] != -1) {
        this.guessEmojis += this.guessResults[i] == 1 ? "✅ " : "❌ ";
      } else {
        this.guessEmojis += "⬜️ "
      }
    }
  }

  validateGameEnd() {
    let numOfWins = 0;
    this.guessResults.forEach((value) => {
      if (value == 1) {
        numOfWins++;
      }
    });

    const gameResult: GameResult = {
      win: true,
      guessResults: this.guessResults
    }

    if (numOfWins == this.NUM_TO_WIN) {
      this.gameEnd.emit(gameResult);
    } else if (this.guesses.length == this.MAX_GUESSES) {
      gameResult.win = false;
      this.gameEnd.emit(gameResult);
    }
  }
}
