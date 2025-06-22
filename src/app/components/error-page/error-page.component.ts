import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

@Component({
    selector: 'error-page',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule
    ],
    templateUrl: './error-page.component.html',
    styleUrl: './error-page.component.scss',
    encapsulation: ViewEncapsulation.None
})


export class ErrorPageComponent {

	constructor(
        private router: Router
	) {}

    refresh() {
        this.router.navigate(['/']);
    }
}
