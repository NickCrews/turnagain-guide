export function stubInProdFn<T extends (...args: any[]) => any>(fn: T, name: string): T {
  return fn;
}