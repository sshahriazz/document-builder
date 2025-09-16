export function debounce<F extends (...args: any[]) => void>(fn: F, delay = 300) {
  let t: ReturnType<typeof setTimeout> | null = null;
  return function(this: any, ...args: Parameters<F>) {
    if (t) clearTimeout(t);
    t = setTimeout(() => {
      fn.apply(this, args);
      t = null;
    }, delay);
  } as F;
}