import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataObservationComponent } from './data-observation.component';

describe('DataObservationComponent', () => {
  let component: DataObservationComponent;
  let fixture: ComponentFixture<DataObservationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataObservationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataObservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
