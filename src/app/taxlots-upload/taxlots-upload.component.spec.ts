import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxlotsUploadComponent } from './taxlots-upload.component';

describe('TaxlotsUploadComponent', () => {
  let component: TaxlotsUploadComponent;
  let fixture: ComponentFixture<TaxlotsUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxlotsUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxlotsUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
