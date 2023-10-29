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
import {NotesService} from "../services/notes.service";

@Component({
  selector: 'app-note-card',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.scss']
})
export class NoteCardComponent implements OnInit ,AfterViewInit {
  @Input() title: string;
  @Input() shortDescription: string;
  @Input() description: string;
  @Input() link: string;
  @Input() index: number;

  @Output('delete') deleteEvent: EventEmitter<void>  = new EventEmitter<void>();
  @Output('checked') checkedEvent: EventEmitter<void>  = new EventEmitter<void>();
  @ViewChild('truncator', { static: false }) truncator: ElementRef<HTMLElement>
  @ViewChild('bodyText' ,{ static: false }) bodyText: ElementRef<HTMLElement>
  updateURl: string;

  constructor(private renderer: Renderer2 ,private  notesService: NotesService) {
  }
ngOnInit() {
    this.updateURl =  'update/' + this.index;
}

  ngAfterViewInit() {

    let style = window.getComputedStyle(this.bodyText.nativeElement,null);
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

  updateChecked() {

  }
}
