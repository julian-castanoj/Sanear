import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateObservationComponent } from './date-observation.component';

describe('DateObservationComponent', () => {
  let component: DateObservationComponent;
  let fixture: ComponentFixture<DateObservationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateObservationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DateObservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
