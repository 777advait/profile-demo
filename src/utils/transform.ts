export function cleanNulls<T extends Record<string, any>>(
  obj: T,
): {
  [K in keyof T]: T[K] extends null ? undefined : T[K];
} {
  const result: any = {};

  for (const key in obj) {
    const value = obj[key];
    result[key] = value ?? undefined;
  }

  return result;
}
