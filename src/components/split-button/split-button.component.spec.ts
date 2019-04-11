import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SplitButton} from './split-button.component';

describe('SplitButtonComponent', () => {
    let component: SplitButton;
    let fixture: ComponentFixture<SplitButton>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SplitButton]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SplitButton);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
