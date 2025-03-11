import { Component } from '@angular/core';
import { GamePageComponent } from '../game-page/game-page.component';
import { GameResult } from '../../model/game-result.model';
import { CommonModule, DatePipe } from '@angular/common';
import { EndPageComponent } from "../end-page/end-page.component";
import { Artist } from '../../model/artist.model';
import { ArtistService } from '../../service/artist/artist.service';
import { GameState } from '../../model/game-state.model';
import { StartPageComponent } from '../start-page/start-page.component';

@Component({
    selector: 'game-root',
    standalone: true,
    imports: [
    GamePageComponent,
    CommonModule,
    EndPageComponent,
    StartPageComponent
],
    templateUrl: './game-root.component.html',
    styleUrl: './game-root.component.scss'
})


export class GameRootComponent {

	gameState: GameState = GameState.Start;
	gameResults: GameResult;

	dailyArtist: Artist

	constructor(
		private artistService: ArtistService,
		private datePipe: DatePipe
	) {}

	ngOnInit(): void {
		this.artistService.getTopArtists()
		.subscribe((artists) => {
			this.getDailyArtist(artists);
		});
	}

	getDailyArtist(artists: Artist[]) {
		const date = new Date();
		const dateString = this.datePipe.transform(date, 'yyyyMMdd') || '';
		this.dailyArtist = artists[+dateString % artists.length]
	}

	navigateToGame() {
		this.gameState = GameState.InProgress;
	}

	navigateToEndPage(result: GameResult) {
		this.gameState = GameState.End;
		this.gameResults = result;
	}
}
