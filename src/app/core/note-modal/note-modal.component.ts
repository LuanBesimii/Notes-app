import {Component, Injectable, Input, OnInit, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-note-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './note-modal.component.html',
  styleUrls: ['./note-modal.component.css'],
})
@Injectable()
export class NoteModalComponent implements OnInit {
@Input() public modalConfig: ModalConfig
@ViewChild('modal') private modalContent: TemplateRef<NoteModalComponent>
  private modalRef: NgbModalRef

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void { }

  open() {
    this.modalRef = this.modalService.open(this.modalContent)
    this.modalRef.result.then()
  }

  close() {
    this.modalRef.close()
  }

  dismiss() {
    this.modalRef.dismiss()
  }
}
