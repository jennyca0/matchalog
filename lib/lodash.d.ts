declare module 'lodash' {
  type DebouncedFunction<T extends (...args: never[]) => unknown> = T & {
    cancel: () => void;
    flush: () => ReturnType<T> | undefined;
  };

  export function debounce<T extends (...args: never[]) => unknown>(
    func: T,
    wait?: number,
  ): DebouncedFunction<T>;
}
