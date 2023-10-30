import {Injectable} from '@angular/core';
import {Note} from "../models/note.model";
import Swal from 'sweetalert2';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  public onNotesChange: Subject<Note[]> = new Subject<Note[]>();

  constructor() {
    this.getAllNotes();
  }


  getAllNotes(): Note[] {
    const notesLocal = localStorage.getItem('notes');
    if (notesLocal != null) {
      return JSON.parse(notesLocal);
    }
    return [];
  }

  getNotesCount(): number {
    return this.getAllNotes().length;
  }

  getNote(id: number): Note {
    return this.getAllNotes()[id];
  }

  addNote(note: Note): boolean {
    const allNotes = this.getAllNotes();
    if (allNotes.some(n => n.id == note.id)) return false;
    allNotes.push(note);
    this.setDataInLocalStorage(allNotes);
    return true;
  }


  updateNote(id: number, title: string, shortDescription: string, description: string) {
    let allNotes = this.getAllNotes();
    let note = allNotes.find(n => n.id == id);
    if (!note) return;
    note.title = title;
    note.shortDescription = shortDescription;
    note.description = description;
    allNotes = allNotes.filter(n => n.id != id);
    allNotes.push(note);
    this.setDataInLocalStorage(allNotes);
  }

  async deleteNotePopup(id:number, callbackIfDeleted: Function = () => {}): Promise<boolean> {
    let result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      allowOutsideClick: false
    });

    if (result.isConfirmed) {
      const removed = this.removeNoteFromLocalStorage(id);
      if(!removed) {
        await Swal.fire(
          'NOT FOUND',
          'Note was not found',
          'error'
        );
        return false;
      }
      if (callbackIfDeleted != null) {
        callbackIfDeleted();
      }
      await Swal.fire(
        'Deleted!',
        'This note has been deleted.',
        'success'
      );

      return true;
    } else {
      return false;
    }
  }

  private removeNoteFromLocalStorage(id: number): boolean{
    let allNotes = this.getAllNotes();

    const found = allNotes.find(n => n.id == id);
    if (!found) return false;

    allNotes = allNotes.filter(n => n.id !== id);
    this.setDataInLocalStorage(allNotes);
    return true;
  }

  updateStatus(id: number, checked: boolean) {
    let allNotes = this.getAllNotes();
    const foundNote = allNotes.find(n => n.id == id);
    if (!foundNote) return;
    foundNote.status = checked;
    allNotes = allNotes.filter(n => n.id != id);
    allNotes.push(foundNote);
    this.setDataInLocalStorage(allNotes);
  }

  updateOrder(id: number, order: number) {
    let allNotes = this.getAllNotes();
    const foundNote = allNotes.find(n => n.id == id);
    if (!foundNote) return;
    foundNote.order = order;
    allNotes = allNotes.filter(n => n.id != id);
    allNotes.push(foundNote);
    this.setDataInLocalStorage(allNotes);
  }

  setDataInLocalStorage(notes: Note[]) {
    localStorage.setItem('notes', JSON.stringify(notes));
    this.onNotesChange.next(notes);
  }
}
