import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaysToRegisterComponent } from './days-to-register.component';

describe('DaysToRegisterComponent', () => {
  let component: DaysToRegisterComponent;
  let fixture: ComponentFixture<DaysToRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DaysToRegisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DaysToRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
