import {ComponentFixture, TestComponentBuilder} from '@angular/compiler/testing';
import {Component} from '@angular/core';
import {async, inject} from '@angular/core/testing';

import {FileDropArea} from './file-drop-area.directive';

describe('File Drop Area:', () => {

    it('test description',
        async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) =>
            tcb.createAsync(TestComponent)
            .then(fixture => {
                expect(fixture).toBeDefined();
            })
        ))
    );

});

@Component({
    template: `<gtx-file-drop-area></gtx-file-drop-area>`,
    directives: [FileDropArea]
})
class TestComponent {
}
