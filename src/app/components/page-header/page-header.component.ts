import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'page-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss'
})
export class PageHeaderComponent {
  @Input() showBackButton: boolean = false;
  
  constructor(private router: Router) {}
  
  onHelpClick(): void {
    this.router.navigate(['/how-to']);
  }
  
  onBackClick(): void {
    this.router.navigate(['/']);
  }
}
