import {fakeAsync} from '@angular/core/testing';

import {worksButHasPendingTimers} from './works-but-has-pending-timers';
import {mustFail} from './must-fail';


describe('worksButHasPendingTimers', () => {

    it('Marks a test as successful when it has pending timers',
        worksButHasPendingTimers(
            fakeAsync(() => {
                setTimeout(() => {}, 100);
            })
        )
    );

    it('Marks a test as failed when it uses no timers',
        mustFail(
            worksButHasPendingTimers(
                fakeAsync(() => {
                    expect(1).toBe(1);
                })
            )
        )
    );

    it('Marks a test as failed when it has no pending timers',
        mustFail(
            worksButHasPendingTimers(
                fakeAsync(() => {
                    let timeout = setTimeout(() => {}, 100);
                    clearTimeout(timeout);
                })
            )
        )
    );

    it('Accepts a count of expected pending timers',
        worksButHasPendingTimers(
            3,
            fakeAsync(() => {
                setTimeout(() => {}, 100);
                setTimeout(() => {}, 100);
                setTimeout(() => {}, 100);
            })
        )
    );

    it('Accepts a count of expected pending timers and fails if they do not match',
        mustFail(
            worksButHasPendingTimers(
                10,
                fakeAsync(() => {
                    setTimeout(() => {}, 100);
                    setTimeout(() => {}, 100);
                })
            )
        )
    );

});
