import { Injectable } from '@angular/core';

declare var gtag : any;

@Injectable({providedIn: 'root'})
export class AnalyticsService {

  private trackEvent(eventName: string, eventDetails: string, eventCategory: string) {
    gtag('event', eventName, {
    // event Type - example: 'SCROLL_TO_TOP_CLICKED'
    'event_category': eventCategory,
    // the label that will show up in the dashboard as the events name
    'event_label': eventName,
    // a short description of what happened
    'value': eventDetails
    })
  }

  userGaveUp() {
    this.trackEvent(
      'Give Up? Clicked',
      'User has opted to end the game early',
      'Game End State'
    )
  }

  userHitTier(tierName: string) {
    this.trackEvent(
      `${tierName} Tier Reached`,
      'User has guessed enough songs to reach',
      'Game State'
    )
  }

  userWon() {
    this.trackEvent(
      'User Won Match',
      'User reached minimum of 3 correct guesses',
      'Game State'
    )
  }

  userHitShare() {
    this.trackEvent(
      'Share Clicked',
      'User has opted to share game with friends',
      'Game End State'
    )
  }
}