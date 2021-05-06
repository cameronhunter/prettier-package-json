declare module 'sort-order' {
  type SortFn<T> = (a: T, b: T) => 1 | 0 | -1;

  function orderBy<T>(...sortFns: SortFn<T>[]): SortFn<T>;

  export = orderBy;
}
