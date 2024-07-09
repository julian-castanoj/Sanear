import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoursPersonnelInterfaceComponent } from './hours-personnel-interface.component';

describe('HoursPersonnelInterfaceComponent', () => {
  let component: HoursPersonnelInterfaceComponent;
  let fixture: ComponentFixture<HoursPersonnelInterfaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HoursPersonnelInterfaceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HoursPersonnelInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
