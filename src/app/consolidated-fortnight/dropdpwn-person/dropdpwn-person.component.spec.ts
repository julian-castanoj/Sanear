import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdpwnPersonComponent } from './dropdpwn-person.component';

describe('DropdpwnPersonComponent', () => {
  let component: DropdpwnPersonComponent;
  let fixture: ComponentFixture<DropdpwnPersonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdpwnPersonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DropdpwnPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
