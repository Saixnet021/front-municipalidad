import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TramitesDashboardComponent } from './tramites-dashboard.component';

describe('TramitesDashboardComponent', () => {
  let component: TramitesDashboardComponent;
  let fixture: ComponentFixture<TramitesDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TramitesDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TramitesDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
