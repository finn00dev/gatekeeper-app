import { Component, HostListener, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { GameResult } from '../../model/game-result.model';
import { CommonModule, DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../environments/environment';
import { StatisticsService } from '../../service/statistics/statistics.service';
import { UserStatistics } from '../../model/user-statistics.model';
import { AnalyticsService } from '../../service/analytics/analytics.service';

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

  currentDate: string = '';
  emojiScore: string;

  showStats: boolean = false;
  userStatistics: UserStatistics;

  constructor(
    private datePipe: DatePipe,
    private cookieService: CookieService,
    private statisticsService: StatisticsService,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit(): void {
    this.buildCurrentDate();
    this.storeCookie();
    this.buildEmojiScore();
    this.getStatistics();
  }

  getStatistics() {
    this.userStatistics = this.statisticsService.getStatistics();
  }

  shareScore() {
    if (navigator.share) {

      let text;
      if (this.result.win) {
        text = `I reached ${this.result.tier.title} ${this.result.tier.emoji} status!\n Play Here: ${environment.liveUrl}`;
      } else {
        text = `Gatekeepr humbled me today :(\nPlay Here: ${environment.liveUrl}`;
      }

      navigator.share({
        title: `gatekeepr: ${this.currentDate}`,
        text: text
      }).catch(() => console.error("Share Error"));
      
      this.analyticsService.userHitShare();
    }
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

  buildEmojiScore() {
    this.emojiScore = `${this.result.tier.emoji} ${this.result.tier.title} ${this.result.tier.emoji}`
  }

  openStats(value: boolean) {
    this.showStats = value;
  }
}
