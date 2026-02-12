import { Component } from '@angular/core';
import { GamePageComponent } from '../game-page/game-page.component';
import { GameResult } from '../../model/game-result.model';
import { CommonModule, DatePipe } from '@angular/common';
import { EndPageComponent } from "../end-page/end-page.component";
import { ArtistService } from '../../service/artist/artist.service';
import { GameState } from '../../model/game-state.model';
import { StartPageComponent } from '../start-page/start-page.component';
import { CookieService } from 'ngx-cookie-service';
import { StatisticsService } from '../../service/statistics/statistics.service';

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

	dailyArtist: string

	constructor(
		private artistService: ArtistService,
		private cookieService: CookieService,
		private statisticsService: StatisticsService
	) {}

	ngOnInit(): void {
		this.isCookiePresent();
		const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		this.artistService.getTodaysArtist(timezone)
		.subscribe((artistName) => {
			this.dailyArtist = artistName;
		});
	}
	
	isCookiePresent(): boolean{
		const cookie_value = this.cookieService.get('todaysResult');
		if (cookie_value) {
			this.gameState = GameState.End;
			this.gameResults = JSON.parse(cookie_value);
			return true;
		}
		return false
	}

	navigateToGame() {
		if (!this.isCookiePresent()) {
			this.gameState = GameState.InProgress;
		}
	}

	navigateToEndPage(result: GameResult) {
		this.gameState = GameState.End;
		this.gameResults = result;
		this.statisticsService.updateStatistics(result);
	}
}
