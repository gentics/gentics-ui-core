import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenticsUiCoreComponent } from './gentics-ui-core.component';

describe('GenticsUiCoreComponent', () => {
  let component: GenticsUiCoreComponent;
  let fixture: ComponentFixture<GenticsUiCoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenticsUiCoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenticsUiCoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
