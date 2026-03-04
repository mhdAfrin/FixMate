export function useDebounceFn<T extends (...args: Parameters<T>) => void>(
  fn: T,
  delay: number
): T {
  let timeout: ReturnType<typeof setTimeout>
  return ((...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), delay)
  }) as T
}