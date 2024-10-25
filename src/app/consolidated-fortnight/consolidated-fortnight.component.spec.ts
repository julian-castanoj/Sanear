import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsolidatedFortnightComponent } from './consolidated-fortnight.component';

describe('ConsolidatedFortnightComponent', () => {
  let component: ConsolidatedFortnightComponent;
  let fixture: ComponentFixture<ConsolidatedFortnightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsolidatedFortnightComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsolidatedFortnightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
