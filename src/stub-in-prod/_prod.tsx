export function stubInProdFn<T extends (...args: any[]) => any>(fn: T, name: string): T {
  return (() => {
    console.warn(`Attempted to call ${name} in production, but it's not available.`);
  }) as T;
}