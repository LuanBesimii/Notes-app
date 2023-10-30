import {Component, Inject, OnInit} from '@angular/core';
import {CommonModule, NgFor} from '@angular/common';
import {FormsModule, NgForm, ReactiveFormsModule} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {Note} from "../../models/note.model";
import {NotesService} from "../../services/notes.service";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-note-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatButtonModule, MatInputModule],
  templateUrl: './note-modal.component.html',
  styleUrls: ['./note-modal.component.css']
})
export class NoteModalComponent implements OnInit{
  modalTitle: string = 'Modal title';

  constructor(@Inject(MAT_DIALOG_DATA) public data: {action: 'update' | 'create' | 'view', note: Note},
              private dialogRef: MatDialogRef<NoteModalComponent>,
              private notesService: NotesService) {
    console.log('in modal: ', data);
    this.setModalTitle()
  }
  async onSubmit(noteForm: NgForm) {
    if (this.data.action === 'view') return;
    if(this.data.action === 'create'){
      const createdNote = this.createNewNote(noteForm);
      this.dialogRef.close(createdNote);
      return;
    }
    if(this.data.action === 'update'){
      const updatedNote = this.updateNote(noteForm);
      this.dialogRef.close(updatedNote);
      return;
    }

  }

  private createNewNote(noteForm: NgForm): Note {
    const allNotes = this.notesService.getAllNotes()
    this.data.note.id = allNotes.length + 1;
    this.data.note.title = noteForm.value.title;
    this.data.note.shortDescription = noteForm.value.shortDescription;
    this.data.note.description = noteForm.value.description;
    this.data.note.status = false;
    this.data.note.date = new Date();
    this.data.note.order = allNotes.length + 1;
    this.notesService.addNote(this.data.note);
    return this.data.note;
  }

  private updateNote(noteForm: NgForm): Note {
    this.notesService.updateNote(this.data.note.id, noteForm.value.title, noteForm.value.shortDescription, noteForm.value.description);
    return this.notesService.getNote(this.data.note.id);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

  private setModalTitle() {
    if (this.data.action === 'create') {
      this.modalTitle = 'CREATE NOTE';
      return;
    }if (this.data.action === 'update') {
      this.modalTitle = 'UPDATE NOTE';
      return;
    }if (this.data.action === 'view') {
      this.modalTitle = 'VIEW NOTE';
      return;
    }
  }
}
