import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckTransportComponent } from './check-transport.component';

describe('CheckTransportComponent', () => {
  let component: CheckTransportComponent;
  let fixture: ComponentFixture<CheckTransportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckTransportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckTransportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
