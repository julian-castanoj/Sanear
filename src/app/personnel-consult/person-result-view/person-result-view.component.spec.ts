import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonResultViewComponent } from './person-result-view.component';

describe('PersonResultViewComponent', () => {
  let component: PersonResultViewComponent;
  let fixture: ComponentFixture<PersonResultViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonResultViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonResultViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
