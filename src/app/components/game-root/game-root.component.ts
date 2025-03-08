import { Component } from '@angular/core';
import { GamePageComponent } from '../game-page/game-page.component';
import { GameResult } from '../../model/game-result.model';
import { CommonModule, DatePipe } from '@angular/common';
import { EndPageComponent } from "../end-page/end-page.component";
import { Artist } from '../../model/artist.model';
import { ArtistService } from '../../service/artist/artist.service';

@Component({
    selector: 'game-root',
    standalone: true,
    imports: [
    GamePageComponent,
    CommonModule,
    EndPageComponent
],
    templateUrl: './game-root.component.html',
    styleUrl: './game-root.component.scss'
})
export class GameRootComponent {

	gameInProgress = true;
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

	navigateToEndPage(result: GameResult) {
		this.gameInProgress = false;
		this.gameResults = result;
	}
}
