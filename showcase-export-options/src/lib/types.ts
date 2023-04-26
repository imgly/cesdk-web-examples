export const PLATFORMS = ['Android', 'iOS', 'Web'] as const;
export type Platform = typeof PLATFORMS[number];

export const isDefined = <T>(x: T | undefined): x is T => x !== undefined;
export function isIn<T>(values: readonly T[], x: any): x is T {
  return values.includes(x);
}
