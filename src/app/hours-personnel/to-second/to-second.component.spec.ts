import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToSecondComponent } from './to-second.component';

describe('ToSecondComponent', () => {
  let component: ToSecondComponent;
  let fixture: ComponentFixture<ToSecondComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToSecondComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToSecondComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
