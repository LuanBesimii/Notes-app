import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatListModule} from "@angular/material/list";
import {NotesService} from "../../services/notes.service";
import {BehaviorSubject} from "rxjs";
import {Note} from "../../models/note.model";

@Component({
  selector: 'app-sidebar',
  standalone: true,
    imports: [CommonModule, MatListModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit{

  checkedNotesCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  uncheckedNotesCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  allNotesCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  constructor(private notesService: NotesService) {
  }

  ngOnInit(): void {
    this.setInfo(this.notesService.getAllNotes());
    this.listenOnNotesChange();
  }

  private listenOnNotesChange() {
    this.notesService.onNotesChange.subscribe(newNotes => {
      this.setInfo(newNotes);
    });
  }

  private setInfo(allNotes: Note[]) {
    this.checkedNotesCount.next(allNotes.filter(n => n.status).length);
    this.uncheckedNotesCount.next(allNotes.filter(n => !n.status).length);
    this.allNotesCount.next(allNotes.length);
  }
}
