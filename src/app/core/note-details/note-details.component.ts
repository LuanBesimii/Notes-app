import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, NgForm} from "@angular/forms";
import {Note} from "../../models/note.model";
import {NotesService} from "../../services/notes.service";
import {ActivatedRoute, Params, Router} from "@angular/router";

@Component({
  selector: 'app-note-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './note-details.component.html',
  styleUrls: ['./note-details.component.scss']
})
export class NoteDetailsComponent implements OnInit {
  constructor(private notesService: NotesService, private router: Router, private route: ActivatedRoute) {
  }

  note: Note;
  newNoteId: number;
  order: number;
  noteId: number;
  stauts: boolean = false
  new: boolean;

  ngOnInit() {

    this.route.params.subscribe((params: Params) => {
        this.note = new Note();
        if (params.id) {
          this.note = this.notesService.getNote(params.id);
          this.noteId = params.id;
          this.new = false;
        } else {
          this.new = true;
        }
      }
    )

  }

  onSubmit(noteForm: NgForm) {

    if (this.new) {
      const newNote = new Note();
      newNote.id = ++this.newNoteId;
      newNote.title = noteForm.value.title;
      newNote.shortDescription = noteForm.value.shortDescription;
      newNote.description = noteForm.value.description;
      newNote.status = this.stauts;
      newNote.date = new Date()
      newNote.order = this.order;
      this.notesService.addNote(newNote);

      console.log(this.order, this.newNoteId, 'notes order and id');
    } else {
      this.notesService.updateNote(this.noteId, noteForm.value.title, noteForm.value.shortDescription, noteForm.value.description);
    }
    this.router.navigateByUrl('/note');

  }

  cancel() {
    this.router.navigateByUrl('/note')
  }
}
