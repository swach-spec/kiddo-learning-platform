export type UnlockType = "feature" | "game";

export type Unlock = {
  id: string;
  name: string;
  description: string;
  type: UnlockType;
  requiredLevel: number;
  icon: string;
};