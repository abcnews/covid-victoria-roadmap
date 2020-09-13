export function ma<T, O>(
  data: T[],
  smoothing: number,
  accessor: (d: T) => number,
  storer: (v: number, d: T) => O
): O[] {
  return data.reduce(
    (acc, d, i, arr) =>
      i < smoothing - 1
        ? acc
        : acc.concat(storer(arr.slice(i - smoothing + 1, i + 1).reduce((t, d) => t + accessor(d), 0) / smoothing, d)),
    [] as O[]
  );
}

export const promiseSpy = (d: unknown) => {
  console.log('d :>> ', d);
  return d;
};

export const mapMap = (cb: <T, O>(d: T, key?: unknown, idx?: number) => O) => (map: Map<unknown, unknown>) => {
  const newMap = new Map();
  let i = 0;
  map.forEach((data, key) => {
    newMap.set(key, cb(data, key, i++));
  });
  return newMap;
};

// Convert the date format d/m/y to a proper Date object
export const toDate = (dateString: string): Date => {
  const [day, m, y] = dateString.split('/').map(d => +d);
  return new Date(y, m - 1, day);
};

export const niceNumber = (n: number): number => {
  return n;
};

export const niceDate = (d: Date, long: boolean = false): string => {
  const months = long
    ? [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ]
    : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return `${months[d.getMonth()]} ${d.getDate()}`;
};

export const subtractDays = (d: Date, days: number) => {
  const res = new Date(d);
};
