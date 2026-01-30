import { levelOne } from "./levels/level-one";
import { MustachioGameContext } from "./mustachi-game-context";

export const startMustachio = (containerId: string) => {
  new MustachioGameContext(containerId).restart(levelOne);
};
