export function assertAllPropertiesNonNull<T extends Record<string, unknown>>(
  obj: T
): asserts obj is T & Record<keyof T, NonNullable<T[keyof T]>> {
  if (
    Object.values(obj).some((value) => value === null || value === undefined)
  ) {
    throw new Error('One or more properties are null or undefined');
  }
}
export const isDefined = <T>(x: T | undefined): x is T => x !== undefined;
export function isIn<T>(values: readonly T[], x: any): x is T {
  return values.includes(x);
}
