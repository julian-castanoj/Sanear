import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToRegisterComponent } from './to-register.component';

describe('ToRegisterComponent', () => {
  let component: ToRegisterComponent;
  let fixture: ComponentFixture<ToRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToRegisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
