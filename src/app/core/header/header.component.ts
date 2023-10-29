import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(private authService: AuthService,private router:Router) {
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);  }
}
