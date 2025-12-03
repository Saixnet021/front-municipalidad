import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnifiedTramiteComponent } from './unified-tramite.component';

describe('UnifiedTramiteComponent', () => {
  let component: UnifiedTramiteComponent;
  let fixture: ComponentFixture<UnifiedTramiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnifiedTramiteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnifiedTramiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
