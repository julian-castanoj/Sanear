import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RangeToRecordComponent } from './range-to-record.component';

describe('RangeToRecordComponent', () => {
  let component: RangeToRecordComponent;
  let fixture: ComponentFixture<RangeToRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RangeToRecordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RangeToRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
