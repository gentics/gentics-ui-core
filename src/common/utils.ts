// Helper functions formerly exported from angular/core/facade/lang
export function isPresent(obj: any): boolean {
  return obj != null;
}

export function isBlank(obj: any): boolean {
  return obj == null;
}

export function isNumber(value: any): boolean {
    return !isNaN(value - parseFloat(value));
}
