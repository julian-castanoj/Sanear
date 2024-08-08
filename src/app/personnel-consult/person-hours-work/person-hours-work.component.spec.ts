import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonHoursWorkComponent } from './person-hours-work.component';

describe('PersonHoursWorkComponent', () => {
  let component: PersonHoursWorkComponent;
  let fixture: ComponentFixture<PersonHoursWorkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonHoursWorkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonHoursWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
