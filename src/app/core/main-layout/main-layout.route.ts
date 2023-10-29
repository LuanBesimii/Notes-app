import {Route} from "@angular/router";
import {NotesComponent} from "../notes/notes.component";
import {NoteDetailsComponent} from "../note-details/note-details.component";

export const MainLayoutRoute: Route[] = [
  {path: '', component: NotesComponent},
  {path: 'new', component: NoteDetailsComponent},
  {path: 'update/:id', component: NoteDetailsComponent},

];
