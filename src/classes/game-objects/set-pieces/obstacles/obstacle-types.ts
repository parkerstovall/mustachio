import type { GameContext } from "../../../../shared/game-context";

export type PipeOptions = {
  x: number;
  y: number;
  width?: number;
  height?: number;
  hasStacheSeed?: boolean;
  reversed?: boolean;
};

export type WarpPipeOptions = PipeOptions & {
  setNewLevel: (gameContext: GameContext) => void;
};
