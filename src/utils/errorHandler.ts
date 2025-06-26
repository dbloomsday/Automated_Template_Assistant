export function withErrorHandling<T extends (...args: any) => Promise<any>>(fn: T) {
  return async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (e: any) {
      console.error(e);
      throw new Error(e?.response?.data?.message ?? 'Something went wrong');
    }
  };
}
