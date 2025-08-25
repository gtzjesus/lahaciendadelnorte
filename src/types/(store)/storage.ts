// types/storage.ts

export type Dimensions = {
  width: number | '';
  length: number | '';
  height: number | '';
};

export type CustomShedForm = {
  dimensions: Dimensions;
  material?: string;
  windows?: {
    hasWindows: boolean;
    quantity?: number;
  };
  doors?: {
    count: number;
  };
  roof?: {
    style: string;
  };
  addons?: string[];
};
