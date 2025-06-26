export function debounce<T extends (...args: any) => void>(fn: T, delay = 300) {
  let id: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(id);
    id = setTimeout(() => fn(...args), delay);
  };
}
