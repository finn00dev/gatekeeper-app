import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../page-header/page-header.component';

@Component({
  selector: 'how-to-page',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  templateUrl: './how-to-page.component.html',
  styleUrl: './how-to-page.component.scss'
})
export class HowToPageComponent {
  
}
