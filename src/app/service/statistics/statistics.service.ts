import { CookieService } from "ngx-cookie-service";
import { Injectable } from "@angular/core";
import { GameResult } from "../../model/game-result.model";
import { UserStatistics } from "../../model/user-statistics.model";

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  apiUrl = 'https://ws.audioscrobbler.com/2.0/?method=';

  constructor(private cookieService: CookieService) { }

  getStatistics(): UserStatistics {
    const history: GameResult[] = JSON.parse(this.cookieService.get('gameHistory'));
    const guesses = history.filter((game) => game.win).reduce((acc, cur) => acc + cur.numberOfGuesses, 0);
    const  numOfWins = history.filter((game) => game.win).length

    return {
      currentStreak: this.cookieService.get('currentStreak') || '0',
      highestStreak: this.cookieService.get('highestStreak') || '0',
      gamesWon: numOfWins,
      gamesTotal: history.length,
      avgGuesses: guesses / numOfWins,
    }
  }

  updateStatistics(gameResult: GameResult) {
    //Current Streak
    let streak = this.updateStreak(gameResult.win);

    //Highest Streak
    this.updateHighestStreak(streak);

    //Game History
    this.updateGameHistory(gameResult)
  }

  updateStreak(result: boolean) {
    const streakValue = this.cookieService.get('currentStreak');
    let newStreak = result ? 1 : 0;

    if (streakValue) {
      this.cookieService.delete('currentStreak');
      newStreak = result ? +streakValue + 1 : 0;
    }

    let expiry = new Date();
    expiry.setDate(expiry.getDate() + 2);
    expiry.setHours(0,0,0,0);
    this.cookieService.set('currentStreak', newStreak.toString(), expiry);

    return newStreak;
  }

  updateHighestStreak(currentStreak: number) {
    const highest = this.cookieService.get('highestStreak');
    if (!highest || +highest < currentStreak) {
      this.cookieService.set('highestStreak', currentStreak.toString(), new Date(2147483647 * 1000));
    }
  }

  updateGameHistory(gameResult: GameResult) {
    const cookie = this.cookieService.get('gameHistory');
    let history: GameResult[] = cookie ? JSON.parse(this.cookieService.get('gameHistory')) : [];
    history.push(gameResult);
    this.cookieService.set('gameHistory', JSON.stringify(history), new Date(2147483647 * 1000));
  }

}
