import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonnelConsultComponent } from './personnel-consult.component';

describe('PersonnelConsultComponent', () => {
  let component: PersonnelConsultComponent;
  let fixture: ComponentFixture<PersonnelConsultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonnelConsultComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonnelConsultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
