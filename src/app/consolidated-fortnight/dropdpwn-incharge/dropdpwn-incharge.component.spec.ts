import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdpwnInchargeComponent } from './dropdpwn-incharge.component';

describe('DropdpwnInchargeComponent', () => {
  let component: DropdpwnInchargeComponent;
  let fixture: ComponentFixture<DropdpwnInchargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdpwnInchargeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DropdpwnInchargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
