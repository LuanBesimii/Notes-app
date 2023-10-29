import {Injectable} from '@angular/core';
import {Note} from "../models/note.model";

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  notes: Note[] = new Array<Note>();

  constructor() {
    this.getAllNotes();
  }


  getAllNotes() {
    const notesLocal = localStorage.getItem('notes');
    if (notesLocal != null) {
      this.notes = JSON.parse(notesLocal);
    }
    return this.notes;
  }

  getNote(id: number) {
    return this.notes[id];
  }

  getNoteId(note: Note): number {
    return this.notes.indexOf(note);
  }

  addNote(note: Note) {
   this.notes.push(note);
   localStorage.setItem('notes', JSON.stringify(this.notes));
  }


  updateNote(id: number, title: string, shortDescription: string, description: string) {
    let note = this.notes[id];
    note.title = title
    note.shortDescription = shortDescription
    note.description = description
  }

  deleteNote(id: number) {
    this.notes.splice(id, 1);
  }
}
