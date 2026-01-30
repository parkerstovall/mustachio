import { BLOCK_SIZE } from "../../shared/constants";
import type { GameContext } from "../../shared/game-context";
import { Floor } from "../../classes/game-objects/set-pieces/obstacles/floor";
import { Flag } from "../../classes/game-objects/set-pieces/flag";

export function testLevelWinGame(gameContext: GameContext) {
  gameContext.clearLevel();

  gameContext.addGameObject(
    new Floor(gameContext, {
      x: 0,
      y: BLOCK_SIZE * 17,
      width: BLOCK_SIZE * 32,
      height: BLOCK_SIZE,
    }),
  );

  gameContext.addGameObject(
    new Flag(gameContext, BLOCK_SIZE * 16, BLOCK_SIZE * 9),
    true,
  );

  gameContext.startMainLoop();
}
