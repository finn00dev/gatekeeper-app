import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ArtistService } from '../../service/artist/artist.service';
import { Artist } from '../../model/artist.model';
import { CommonModule, DatePipe } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { GameResult } from '../../model/game-result.model';
import { AutoCompleteModule } from 'primeng/autocomplete';

@Component({
    selector: 'game-page',
    standalone: true,
    imports: [
        CommonModule,
        InputTextModule,
        FormsModule,
        AutoCompleteModule
    ],
    templateUrl: './game-page.component.html',
    styleUrl: './game-page.component.scss'
})

export class GamePageComponent implements OnInit {

  @Input() dailyArtist: Artist;
  @Output() gameEnd = new EventEmitter<GameResult>();

  MAX_GUESSES = 5;
  NUM_TO_WIN = 3;

  artistSongs: string[];

  guessText: string;
  guesses: string[] = [];
  guessResults: number[] = [];

  autoSuggestions: string[];

  constructor(
    private artistService: ArtistService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.initGame();
  }

  initGame() {
    this.getSongList();
  }

  getSongList() {
    this.artistService.getTopSongs(this.dailyArtist.name)
      .subscribe((songs) => {
        console.log(songs);
        this.artistSongs = songs;
      });
  }

  fillAutoComplete(event: any) {
    console.log(event);
    this.artistService.searchSongs(event.query).subscribe((songs) => {
      console.log(songs);
      this.autoSuggestions = songs;
    })
  }

  guessSong() {
    console.log(this.guessText);

    const song = this.artistSongs.find((song) => song == this.guessText);

    if (song) {
      this.guesses.push(song);
      this.guessResults.push(1);
    } else {
      this.guesses.push(this.guessText);
      this.guessResults.push(0);
    }

    this.guessText = "";
    this.validateGameEnd();
  }

  validateGameEnd() {
    let numOfWins = 0;
    this.guessResults.forEach((value) => {
      if (value) {
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
