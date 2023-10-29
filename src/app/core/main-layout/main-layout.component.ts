import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HeaderComponent} from "../header/header.component";
import {RouterOutlet} from "@angular/router";
import {MatListModule} from "@angular/material/list";
import {SidebarComponent} from "../sidebar/sidebar.component";

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, HeaderComponent, RouterOutlet, MatListModule, SidebarComponent],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {

}
