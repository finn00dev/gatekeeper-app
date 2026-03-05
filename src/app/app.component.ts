import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'gatekeeper-app';

  constructor(
    private router: Router,
    private meta: Meta,
    private titleService: Title
  ) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateMetaTags(this.router.url);
    });
    
    // Set initial meta tags
    this.updateMetaTags(this.router.url);
  }

  private updateMetaTags(url: string) {
    const routeData = this.getRouteData(url);
    
    // Update title
    this.titleService.setTitle(routeData.title);
    
    // Update description
    this.meta.updateTag({ name: 'description', content: routeData.description });
    
    // Update Open Graph
    this.meta.updateTag({ property: 'og:title', content: routeData.title });
    this.meta.updateTag({ property: 'og:description', content: routeData.description });
    this.meta.updateTag({ property: 'og:url', content: `https://gate-keepr.com${url}` });
    
    // Update Twitter Card
    this.meta.updateTag({ property: 'twitter:title', content: routeData.title });
    this.meta.updateTag({ property: 'twitter:description', content: routeData.description });
  }

  private getRouteData(url: string) {
    const routes: { [key: string]: { title: string; description: string } } = {
      '/': {
        title: 'gatekeepr',
        description: 'Test your music knowledge with Gatekeepr! Every day we pick a new artist - can you name 3 songs? Challenge yourself with this daily music guessing game made for true music fans.'
      },
      '/how-to': {
        title: 'how to - gatekeepr',
        description: 'Learn how to play Gatekeepr! Discover the rules, gameplay mechanics, and tips for success in this daily music guessing game. Can you name 3 songs by today\'s artist?'
      },
      '/daily': {
        title: 'daily - gatekeepr',
        description: 'Today\'s Gatekeepr challenge is live! Test your music knowledge and see if you can name 3 songs by today\'s featured artist. Play now and prove you\'re a real fan!'
      },
      '/results': {
        title: 'results - gatekeepr',
        description: 'See how you did in today\'s Gatekeepr challenge! Check your score, tier status, and compare with other music fans. Did you make it to the top tier?'
      }
    };

    return routes[url] || routes['/'];
  }
}
