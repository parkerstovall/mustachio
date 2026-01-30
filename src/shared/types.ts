import type { GameObject } from "./game-objects/game-object";

export const direction = {
  UP: 1,
  DOWN: 2,
  LEFT: 3,
  RIGHT: 4,
  NONE: 0,
};

export type rectangle = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type collision = {
  gameObject: GameObject;
  collisionDirection: number;
};
