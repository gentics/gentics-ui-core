import { TestBed } from '@angular/core/testing';

import { GenticsUiCoreService } from './gentics-ui-core.service';

describe('GenticsUiCoreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GenticsUiCoreService = TestBed.get(GenticsUiCoreService);
    expect(service).toBeTruthy();
  });
});
