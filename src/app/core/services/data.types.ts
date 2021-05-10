/* STYLE */
export type Style = {
  fontSize: number;
  fontFamily: string;
  showHelper: boolean;
};

export const DEFAULT_STYLE: Style = {
  fontFamily: 'Arial',
  fontSize: 5,
  showHelper: false,
};

/* STATS */
export type Stats = {};

export const DEFUALT_STATS: Stats = {};

/* USER */
export const DEFAULT_USER: User = {
  stats: DEFUALT_STATS,
  name: '(no name)',
};

export type User = {
  stats: Stats;
  name: string;
};

/*xxxx*/
