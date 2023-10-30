import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HeaderComponent} from "../header/header.component";
import {NoteCardComponent} from "../../note-card/note-card.component";
import {Note} from "../../models/note.model";
import {NotesService} from "../../services/notes.service";
import {ActivatedRoute, Router, RouterLink, RouterModule} from "@angular/router";
import {animate, query, stagger, style, transition, trigger} from "@angular/animations";
import {CdkDrag, CdkDragDrop, CdkDropList, DragDropModule, moveItemInArray} from "@angular/cdk/drag-drop";
import {MatButtonModule} from "@angular/material/button";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NoteModalComponent} from "../../modals/note-modal/note-modal.component";
import {MatDialog} from "@angular/material/dialog";
import {BehaviorSubject} from "rxjs";
import {OrderNotesPipe} from "../../pipes/order-notes.pipe";

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HeaderComponent, NoteCardComponent, RouterModule, RouterLink, CdkDrag, CdkDropList, DragDropModule, MatButtonModule, OrderNotesPipe],
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
  filteredNotes: BehaviorSubject<Note[]> = new BehaviorSubject<Note[]>([]);

  @ViewChild('filterInput') filterInputElRef: ElementRef<HTMLInputElement>;

  constructor(private notesService: NotesService, private router: Router, private route: ActivatedRoute, private matDialog: MatDialog, private cdR: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.setFilteredNotes(this.notesService.getAllNotes());
  }

  async deleteNote(note: Note) {
    await this.notesService.deleteNotePopup(note.id, () => this.refreshData());
    this.setFilteredNotes(this.notesService.getAllNotes());
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
      allResults = [...allResults, ...results];
    });
    //allresults will have duplicate notes
    let uniqueResults = this.removeDuplicates(allResults);
    this.filteredNotes.next(uniqueResults);
  }

  removeDuplicates(arr: Array<any>): Array<any> {
    let uniqueResults: Set<any> = new Set<any>();

    arr.forEach(e => uniqueResults.add(e));
    return Array.from(uniqueResults);
  }

  relevantNotes(query: string): Array<Note> {
    query = query.toLowerCase().trim();
    let relevantNotes = this.notesService.getAllNotes().filter(note => {
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

  checkToggle(note: Note, checked: boolean) {
    this.notesService.updateStatus(note.id, checked);
  }

  drop(event: CdkDragDrop<Note[]>) {
    let from = this.filteredNotes.value[event.previousIndex];
    let to = this.filteredNotes.value[event.currentIndex];
    from.order = event.currentIndex + 1;
    to.order = event.previousIndex + 1;
    moveItemInArray(this.filteredNotes.value, event.previousIndex, event.currentIndex);
    this.notesService.updateOrder(from.id, event.currentIndex + 1);
    this.notesService.updateOrder(to.id, event.previousIndex + 1);
  }

  editNote(note: Note) {
    const ref = this.matDialog.open(NoteModalComponent, {data: {action: 'update', note: note}});
    ref.afterClosed().subscribe(editedNote => {
      if (!editedNote) return
      const index = this.filteredNotes.value.findIndex(n => n.id == editedNote.id);
      if (index < 0) return;
      this.filteredNotes.value[index] = editedNote;
    });
  }

  openNewNoteModal() {
    const ref = this.matDialog.open<NoteModalComponent>(NoteModalComponent, {
      data: {
        action: 'create',
        note: new Note()
      }
    });
    ref.afterClosed().subscribe(createdNote => {
      if (!createdNote) return;
      this.filteredNotes.value.push(createdNote);
    });
  }

  refreshData() {
    this.setFilteredNotes(this.notesService.getAllNotes());
    if (this.filterInputElRef.nativeElement.value && this.filterInputElRef.nativeElement.value.trim() != '') {
      this.filter(this.filterInputElRef.nativeElement.value);
    }
  }

  private setFilteredNotes(allNotes: Note[]) {
    const orderedNotes = this.orderNotes(allNotes);
    this.filteredNotes.next(orderedNotes);
  }

  private orderNotes(allNotes: Note[]) {
    return allNotes.sort((a, b) => {
      if (a.order > b.order) return 1;
      if (a.order < b.order) return -1;
      return 0;
    });
  }

  viewNote(note: Note) {
    this.matDialog.open<NoteModalComponent>(NoteModalComponent, {
      data: {
        action: 'view',
        note: note
      }
    })
  }
}
