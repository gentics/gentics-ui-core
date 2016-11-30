declare var window: any;
declare var global: any;
declare var Zone: any;
/**
 * Specifies a test that must fail in order for the outer test to succeed.
 *
 * Usage:
 * ```typescript
 * describe('some feature', () => {
 *     it('fails when something happens',
 *         mustFail(() => {
 *             expect('no').toBe('yes')
 *         })
 *     )
 * });
 * ```
 */
export function mustFail(testThatShouldFail: ((done: DoneFn) => void) | (() => (void|Promise<any>))): (inverted: DoneFn) => void {
    const _global: any = (typeof window !== undefined ? window : global);
    // We need to get a reference to the root Zone in order to avoid the exception
    // "unexpected Zone: ProxyZone"
    const rootZone = Zone.current.parent;

    return function invertedDoneFunction(realDone: DoneFn): void {
        let outerExpect = expect;
        let env: any = new (<any> jasmine).Env();
        let spec: any;

        rootZone.run(() => {
            env.describe('fake test suite', () => {
                spec = env.it('test that should fail', <any> function (callback: DoneFn): void {
                    try {
                        let result: any;
                        if (testThatShouldFail.length === 1) {
                            (<(cb: Function) => void> testThatShouldFail)(callback);
                        } else {
                            _global.expect = env.expect.bind(env);
                            result = (<() => any> testThatShouldFail)();
                            if (result && typeof result === 'object' && typeof result.then === 'function') {
                                result.then(() => callback(), (err: any) => callback.fail(err));
                            } else {
                                callback();
                            }
                        }
                    } catch (err) {
                        callback.fail(err);
                    }
                });
            });

            env.addReporter({
                jasmineDone(): void {
                    _global.expect = outerExpect;

                    if (spec.result.status === 'passed') {
                        realDone.fail('Test should have failed, but it passed');
                    } else {
                        realDone();
                    }
                }
            });

            env.execute();
        });

    };
}
