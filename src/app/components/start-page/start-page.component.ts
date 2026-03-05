import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ArtistService } from '../../service/artist/artist.service';
import { PageHeaderComponent } from '../page-header/page-header.component';

@Component({
  selector: 'start-page',
  standalone: true,
  imports: [
    ButtonModule,
    PageHeaderComponent
  ],
  templateUrl: './start-page.component.html',
  styleUrl: './start-page.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class StartPageComponent implements OnInit {
  dailyArtist: string;

  constructor(
    private artistService: ArtistService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    this.artistService.getTodaysArtist(timezone).subscribe((artistName) => {
      this.dailyArtist = artistName;
    });
  }

  clickStart(): void {
    this.router.navigate(['/daily']);
  }
}
