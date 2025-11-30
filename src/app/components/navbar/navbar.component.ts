import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './navbar.component.html'
})
export class NavbarComponent {
    user: any = null;

    constructor(private authService: AuthService) {
        this.authService.getUser().subscribe(user => {
            this.user = user;
        });
    }

    logout() {
        this.authService.logout();
    }
}
