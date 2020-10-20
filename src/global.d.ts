export type RawVictoriaLGADataRow = {
  Date: string;
  LGA: string;
  'Total Cases': string;
  'Active Cases': string;
};

export type RawDailyCountCases = {
  'Date Announced': string;
  'State/territory': string;
  'Cumulative confirmed': string;
  'New cases': string;
};

export type RawVictora14DayRow = {
  Date: string;
  'Metro Average': string;
  'Regional Average': string;
  'Metro Unknown': string;
  'Regional Unknown': string;
};

export type Victoria14DayRow = {
  date: Date;
  metro: number;
  regional: number;
  metroUnknown: number;
  regionalUnknown: number;
  state: number;
};

export type RawVictoriaLGAData = RawVictoriaLGADataRow[];

export type Region = 'metro' | 'regional' | 'state';

export type DataRow = {
  date: Date;
  region: number;
  state: number;
  unknown: number;
};

declare module 'd3-array' {
  export function maxIndex<I>(data: ArrayLike, accessor: (item: I) => number);
}
