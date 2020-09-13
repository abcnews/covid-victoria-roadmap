export type RawVictoriaLGADataRow = {
  Date: string;
  LGA: string;
  'Total Cases': string;
  'Active Cases': string;
};

export type RawVictora14DayRow = {
  Date: string;
  'Metro Average': string;
  'Regional Average': string;
};

export type Victoria14DayRow = {
  date: Date;
  metro: number;
  regional: number;
};

export type RawVictoriaLGAData = RawVictoriaLGADataRow[];

export type Region = 'metro' | 'regional' | 'state';

export type DataRow = {
  date: Date;
  value: number;
};

declare module 'd3-array' {
  export function maxIndex<I>(data: ArrayLike, accessor: (item: I) => number);
}
