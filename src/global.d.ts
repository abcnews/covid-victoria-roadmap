export type RawVictoriaLGADataRow = {
  Date: string;
  LGA: string;
  'Total Cases': string;
  'Active Cases': string;
};

export type RawVictoriaLGAData = RawVictoriaLGADataRow[];

export type Jurisdiction = 'metro' | 'regional' | 'state';

export type DataRow = {
  date: Date;
  value: number;
};

declare module 'd3-array' {
  export function maxIndex<I>(data: ArrayLike, accessor: (item: I) => number);
}
