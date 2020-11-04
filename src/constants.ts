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
  metro: [],
  regional: []
};
