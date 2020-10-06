export type Milestone = {
  date?: Date;
  colour?: string;
  targetColour?: string;
  value: number;
};

export type Milestones = {
  metro: Milestone[];
  regional: Milestone[];
};

export const ONE_DAY_MS: number = 1000 * 60 * 60 * 24;

export const milestones: Milestones = {
  metro: [
    {
      date: new Date(2020, 8, 28),
      value: 50,
      colour: '#1D6EA0',
      targetColour: '#248BC9'
    },
    {
      date: new Date(2020, 9, 19),
      value: 5,
      colour: '#BD3C00',
      targetColour: '#FF6100'
    },
    {
      date: new Date(2020, 10, 23),
      value: 0
    }
  ],
  regional: [
    {
      value: 5
    }
  ]
};
