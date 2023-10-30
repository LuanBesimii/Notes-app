import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from "@angular/router";
import { MatDialogModule} from "@angular/material/dialog";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NotesService} from "../services/notes.service";
import {Note} from "../models/note.model";

@Component({
  selector: 'app-note-card',
  standalone: true,
  imports: [CommonModule ,FormsModule,ReactiveFormsModule, RouterModule, MatDialogModule, MatCheckboxModule],
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.scss']
})
export class NoteCardComponent implements OnInit, AfterViewInit {
  @Input() note: Note;
  @Output('delete') deleteEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output('edit') editEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output('checked') checkedEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() cardBodyClicked: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('truncator', {static: false}) truncator: ElementRef<HTMLElement>
  @ViewChild('bodyText', {static: false}) bodyText: ElementRef<HTMLElement>

  constructor(private renderer: Renderer2, private  notesService: NotesService) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {

    let style = window.getComputedStyle(this.bodyText.nativeElement, null);
    let viewableHeight = parseInt(style.getPropertyValue("height"), 10);

    if (this.bodyText) {


      if (this.bodyText.nativeElement.scrollHeight > viewableHeight) {
        this.renderer.setStyle(this.truncator.nativeElement, 'display', 'block')
      } else {
        this.renderer.setStyle(this.truncator.nativeElement, 'display', 'none');
      }
    }
  }

  deleteNote() {
    this.deleteEvent.emit();
  }

  updateChecked(event: Event) {
    this.checkedEvent.emit((event.target as any).checked);
  }

  editNote() {
    this.editEvent.emit();
  }

  viewNote() {
    this.cardBodyClicked.emit();
  }
}
