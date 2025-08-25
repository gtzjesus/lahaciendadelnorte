// types/storage.ts

export type Dimensions = {
  width: number | '';
  length: number | '';
  height: number | '';
};

export type CustomShedForm = {
  dimensions: Dimensions;
  // Add more fields here as you build new steps
  // material?: string;
  // windows?: number;
  // doors?: number;
  // etc.
};
