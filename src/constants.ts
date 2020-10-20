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

export const milestones: Milestones = {
  metro: [
    {
      value: 5,
      colour: '#BD3C00',
      targetColour: '#FF6100'
    }
  ],
  regional: []
};
