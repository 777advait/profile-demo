export function cleanNulls<T extends Record<string, unknown>>(
  obj: T,
): {
  [K in keyof T]: T[K] extends null ? undefined : T[K];
} {
  const result: Partial<T> = {};

  for (const key in obj) {
    const value = obj[key];
    result[key] = value ?? undefined;
  }

  return result as { [K in keyof T]: T[K] extends null ? undefined : T[K] };
}
