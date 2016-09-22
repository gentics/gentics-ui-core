/**
 * Utility function to mark a test as working when it fails
 * with pending timers, but the behavior is expected.
 * Marks the test as failed if the test case does not fail with pending timers.
 */
export function worksButHasPendingTimers(testCase: Function): () => void;
export function worksButHasPendingTimers(count: number, testCase: Function): () => void;

export function worksButHasPendingTimers(first: Function | number, second?: Function): () => void {
    let count = (typeof first === 'number') ? first : 1;
    let testCase = (typeof first === 'function') ? first : second;

    return () => {
        expect(testCase).toThrowError(`${count} timer(s) still in the queue.`);
    };
}
