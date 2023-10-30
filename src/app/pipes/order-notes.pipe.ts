import { Pipe, PipeTransform } from '@angular/core';
import {Note} from "../models/note.model";

@Pipe({
  name: 'orderNotes',
  standalone: true
})
export class OrderNotesPipe implements PipeTransform {

  transform(value: Note[] | null, propertyName: string, direction: 'asc' | 'dsc' = 'asc'): Note[] {
    if (value == null) return [];
    const directionNumber = direction === 'asc' ? 1 : -1
    return value.sort((a,b) => {
      if (a[propertyName] > b[propertyName]) return 1 * directionNumber;
      if (a[propertyName] < b[propertyName]) return -1 * directionNumber;
      return 0;
    });
  }

}
