import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteModalComponent } from './note-modal.component';

describe('NoteModalComponent', () => {
  let component: NoteModalComponent;
  let fixture: ComponentFixture<NoteModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoteModalComponent]
    });
    fixture = TestBed.createComponent(NoteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
