/**
 * Components with boolean inputs may receive the value as an actual boolean (if data-bound `[prop]="false"`) or as
 * a string representation of a boolean (if passed as a regular attribute `prop="false"`).
 * In the latter case, we want to ensure that the string version is correctly coerced to its boolean counterpart.
 */
export function coerceToBoolean(val: any): boolean {
    return val === true || val === 'true';
}
