import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatListModule} from "@angular/material/list";

@Component({
  selector: 'app-sidebar',
  standalone: true,
    imports: [CommonModule, MatListModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

}
