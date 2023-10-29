import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HeaderComponent} from "../header/header.component";
import {NoteCardComponent} from "../../note-card/note-card.component";
import {Note} from "../../models/note.model";
import {NotesService} from "../../services/notes.service";
import {RouterLink, RouterModule} from "@angular/router";
import {animate, query, stagger, style, transition, trigger} from "@angular/animations";
import {CdkDrag, CdkDragDrop, CdkDropList, DragDropModule, transferArrayItem} from "@angular/cdk/drag-drop";
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [CommonModule, HeaderComponent, NoteCardComponent, RouterModule, RouterLink, CdkDrag, CdkDropList, DragDropModule,MatButtonModule],
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
  animations: [
    trigger('itemAnim', [
      //entry animation
      transition('void => *', [
        //Initial State
        style({
          height: 0,
          opacity: 0,
          transform: 'scale(0.85)',
          'margin-bottom': 0,
          paddingTop: 0,
          paddingBottom: 0,
          paddingRight: 0,
          paddingLeft: 0,
        }),
        //anitmate the spacing (height  and margin)
        animate('50ms', style({
          //height * gets the height of element
          height: '*',
          'margin-bottom': '*',
          paddingTop: '*',
          paddingBottom: '*',
          paddingRight: '*',
          paddingLeft: '*',
        })),
        animate(68)
      ]),

      transition('* => void', [
        // scale up
        animate(50, style({
          transform: 'scale(1.05)'
        })),
        //then scale down to normal while fading out
        animate(50, style({
            transform: 'scale(1)',
            opacity: 0.75
          }
        )),
        //scale down and fade out completely
        animate('120ms ease-out', style(
          {
            transform: 'scale(0.68)',
            opacity: 0,
          }
        )),
        //animate spacing
        animate('150ms ease-out', style({
          height: 0,
          transform: 'scale(0.85)',
          'margin-bottom': 0,
          paddingTop: 0,
          paddingBottom: 0,
          paddingRight: 0,
          paddingLeft: 0,
        }))
      ])
    ]),
    trigger('listAnim', [
      transition('* => *', [
        //* =>* is for all states
        query(':enter', [
          style({
            opacity: 0,
            height: 0,
          }),
          stagger(100, [
            animate('0.2s ease')
          ])
        ], {optional: true})
      ])
    ])
  ]
})
export class NotesComponent implements OnInit {
  notes: Note[] = new Array<Note>();
  checkedCount: number = 0;
  uncheckedCount: number = 0;
  order: number = 1;
  filteredNotes: Note[] = new Array<Note>();

  @ViewChild('filterInput') filterInputElRef: ElementRef<HTMLInputElement>;

  constructor(private notesService: NotesService) {
  }

  ngOnInit() {
    this.notes = this.notesService.getAllNotes();
    // console.log(this.notes, 'notes');
    this.filteredNotes = this.notesService.getAllNotes();
    this.filter('');
    this.updateCheckedCount();

  }

  deleteNote(note) {
    let noteId = this.notesService.getNoteId(note);
    this.notesService.deleteNote(noteId);
    this.filter(this.filterInputElRef.nativeElement.value);
  }

  filter(query: string) {
    query = query.toLowerCase().trim();
    let allResults: Note[] = new Array<Note>();
    //split the search query into individual words
    let terms: string[] = query.split(' ');
    //remove duplicate
    terms = this.removeDuplicates(terms);
    //compile all relevant results in all results array

    terms.forEach(term => {
      let results: Note[] = this.relevantNotes(term);
      //es6 feature array desctructioring
      allResults = [...allResults, ...results];
    });
    //allresults will have duplicate notes
    let uniqueResults = this.removeDuplicates(allResults);
    this.filteredNotes = uniqueResults;
    this.sortByRelevancy(allResults);
  }

  removeDuplicates(arr: Array<any>): Array<any> {
    let uniqueResults: Set<any> = new Set<any>();

    arr.forEach(e => uniqueResults.add(e));
    return Array.from(uniqueResults);
  }

  relevantNotes(query: string): Array<Note> {
    query = query.toLowerCase().trim();
    let relevantNotes = this.notes.filter(note => {
      if (
        note.title && note.title.toLowerCase().includes(query)
      ) {
        return true;
      }
      if (
        note.shortDescription && note.shortDescription.toLowerCase().includes(query)
      ) {
        return true
      }
      if (
        note.description && note.description.toLowerCase().includes(query)
      ) {
        return true
      }
      return false;
    })
    return relevantNotes;
  }

  sortByRelevancy(searchResult: Note[]) {
    let noteCountObject: any;
    searchResult.forEach(note => {
      let noteId = this.notesService.getNoteId(note)
      if (noteCountObject[noteId]) {
        noteCountObject[noteId] += 1;
      } else {
        noteCountObject[noteId] = 1
      }
    })

    this.filteredNotes = this.filteredNotes.sort((a: Note, b: Note) => {
      let aId = this.notesService.getNoteId(a);
      let bId = this.notesService.getNoteId(b);
      let aCount = noteCountObject[aId];
      let bCount = noteCountObject[bId];
      return bCount - aCount;
    })
  }

  getNoteID(note: Note): string {
    let noteId = this.notesService.getNoteId(note).toString();
    let allUrl = "update/" + noteId;
    return allUrl;
  }

  checkToggle(note: Note) {

  }

  private updateCheckedCount() {
    this.checkedCount = this.notes.filter(note => note.status).length;
    this.uncheckedCount = this.notes.length - this.checkedCount;
  }

  drop(event: CdkDragDrop<Note[]>) {

  }
}
