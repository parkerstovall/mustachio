import { GameContext } from "../shared/game-context";
import {
  createBlockPyramid,
  createBlockSquare,
  createBlockWall,
} from "./level-helpers";
import { BLOCK_SIZE } from "../shared/constants";
import { Floor } from "../classes/game-objects/set-pieces/obstacles/floor";
import { ItemBlock } from "../classes/game-objects/set-pieces/obstacles/blocks/punchable-blockS/item-block";
import { Brick } from "../classes/game-objects/set-pieces/obstacles/blocks/punchable-blockS/brick";
import { Wall } from "../classes/game-objects/set-pieces/obstacles/blocks/wall";
import { StacheStalker } from "../classes/game-objects/point-objects/enemies/stache-stalker";
import { Pipe } from "../classes/game-objects/set-pieces/obstacles/pipe";
import { WarpPipe } from "../classes/game-objects/set-pieces/obstacles/warp-pipe";
import { caveOne } from "./caves/cave-one";
import { StacheCannon } from "../classes/game-objects/set-pieces/obstacles/blocks/stache-cannon";
import { direction } from "../shared/types";
import { FireCrossBlock } from "../classes/game-objects/set-pieces/obstacles/blocks/fire-cross-block";
import { FireBarBlock } from "../classes/game-objects/set-pieces/obstacles/blocks/fire-bar-block";
import { StacheStreaker } from "../classes/game-objects/point-objects/enemies/stache-streaker";
import { Flag } from "../classes/game-objects/set-pieces/flag";

export function levelOne(
  gameContext: GameContext,
  previousLevels: string[] = [],
) {
  gameContext.clearLevel();

  sectionOne(gameContext);
  sectionTwo(gameContext);
  sectionThree(gameContext, previousLevels);
  sectionFour(gameContext);
  sectionFive(gameContext);
  sectionSix(gameContext);
  sectionSeven(gameContext);

  if (previousLevels[0] === "cave-one") {
    gameContext.setPlayerLocation(BLOCK_SIZE * 69, BLOCK_SIZE * 8);
  }

  gameContext.startMainLoop();
}

function sectionOne(gameContext: GameContext) {
  // Floor
  gameContext.addGameObject(
    new Floor(gameContext, {
      x: 0,
      y: BLOCK_SIZE * 17,
      width: BLOCK_SIZE * 40,
      height: BLOCK_SIZE,
    }),
  );

  // First barrier
  createBlockWall(gameContext, 0, 0, 1, 17, "wall");
  createBlockWall(gameContext, 1, 5, 1, 11, "coin");

  gameContext.addGameObject(
    new ItemBlock(gameContext, BLOCK_SIZE * 6, BLOCK_SIZE * 14, false, "coin"),
  );

  gameContext.addGameObject(
    new Brick(gameContext, BLOCK_SIZE * 7, BLOCK_SIZE * 14),
  );

  gameContext.addGameObject(
    new ItemBlock(gameContext, BLOCK_SIZE * 8, BLOCK_SIZE * 14, true, "coin"),
  );

  gameContext.addGameObject(
    new ItemBlock(gameContext, BLOCK_SIZE * 8, BLOCK_SIZE * 11, true, "coin"),
  );

  gameContext.addGameObject(
    new Brick(gameContext, BLOCK_SIZE * 9, BLOCK_SIZE * 14),
  );

  gameContext.addGameObject(
    new ItemBlock(gameContext, BLOCK_SIZE * 10, BLOCK_SIZE * 14, false, "coin"),
  );

  createBlockPyramid(gameContext, 16, 16, 12, "wall");

  gameContext.addGameObject(
    new Wall(gameContext, BLOCK_SIZE * 39, BLOCK_SIZE * 16),
  );

  gameContext.addGameObject(
    new StacheStalker(gameContext, BLOCK_SIZE * 28, BLOCK_SIZE * 14),
  );

  gameContext.addGameObject(
    new StacheStalker(gameContext, BLOCK_SIZE * 34, BLOCK_SIZE * 14),
  );
}

function sectionTwo(gameContext: GameContext) {
  gameContext.addGameObject(
    new Wall(gameContext, BLOCK_SIZE * 46, BLOCK_SIZE * 16),
  );

  gameContext.addGameObject(
    new ItemBlock(gameContext, BLOCK_SIZE * 49, BLOCK_SIZE * 13, false, "coin"),
  );

  gameContext.addGameObject(
    new ItemBlock(
      gameContext,
      BLOCK_SIZE * 49,
      BLOCK_SIZE * 9,
      true,
      "stacheroom",
    ),
  );

  createBlockSquare(gameContext, 53, 11, 6, 4, "brick");
  createBlockWall(gameContext, 54, 12, 4, 2, "coin");

  gameContext.addGameObject(
    new Pipe(gameContext, {
      x: BLOCK_SIZE * 64,
      y: BLOCK_SIZE * 15,
      hasStacheSeed: true,
    }),
  );

  // Floor
  gameContext.addGameObject(
    new Floor(gameContext, {
      x: BLOCK_SIZE * 46,
      y: BLOCK_SIZE * 17,
      width: BLOCK_SIZE * 20,
      height: BLOCK_SIZE,
    }),
  );
}

function sectionThree(gameContext: GameContext, previousLevels: string[]) {
  createBlockWall(gameContext, 66, 17, 23, 1, "wall");
  let pipe: Pipe;
  if (previousLevels.includes("cave-one")) {
    pipe = new Pipe(gameContext, {
      x: BLOCK_SIZE * 73,
      y: BLOCK_SIZE * 9,
    });
  } else {
    pipe = new WarpPipe(gameContext, {
      x: BLOCK_SIZE * 73,
      y: BLOCK_SIZE * 9,
      setNewLevel: caveOne,
    });
  }

  createBlockWall(gameContext, 73, 11, 2, 1, "wall");

  gameContext.addGameObject(pipe);

  createBlockWall(gameContext, 78, 16, 1, 1, "wall");
  gameContext.addGameObject(
    new StacheCannon(
      gameContext,
      BLOCK_SIZE * 78,
      BLOCK_SIZE * 15,
      direction.LEFT,
    ),
  );

  createBlockWall(gameContext, 80, 15, 1, 2, "wall");
  gameContext.addGameObject(
    new StacheCannon(
      gameContext,
      BLOCK_SIZE * 80,
      BLOCK_SIZE * 14,
      direction.LEFT,
    ),
  );

  createBlockWall(gameContext, 82, 14, 1, 3, "wall");
  gameContext.addGameObject(
    new StacheCannon(
      gameContext,
      BLOCK_SIZE * 82,
      BLOCK_SIZE * 13,
      direction.LEFT,
    ),
  );

  createBlockWall(gameContext, 84, 13, 1, 4, "wall");
  gameContext.addGameObject(
    new StacheCannon(
      gameContext,
      BLOCK_SIZE * 84,
      BLOCK_SIZE * 12,
      direction.LEFT,
    ),
  );
}

function sectionFour(gameContext: GameContext) {
  createBlockWall(gameContext, 89, 17, 33, 1, "falling-floor");

  for (let i = 0; i < 11; i++) {
    gameContext.addGameObject(
      new Pipe(gameContext, {
        x: BLOCK_SIZE * (89 + i * 3),
        y: 0,
        height: BLOCK_SIZE * 14,
        hasStacheSeed: true,
        reversed: true,
      }),
    );
  }

  createBlockWall(gameContext, 122, 17, 5, 1, "wall");
}

function sectionFive(gameContext: GameContext) {
  createBlockWall(gameContext, 126, 14, 1, 3, "wall");

  gameContext.addGameObject(
    new ItemBlock(
      gameContext,
      BLOCK_SIZE * 121,
      BLOCK_SIZE * 13,
      false,
      "stacheroom",
    ),
  );

  gameContext.addGameObject(
    new FireCrossBlock(gameContext, BLOCK_SIZE * 126, BLOCK_SIZE * 13, [
      direction.LEFT,
      direction.RIGHT,
    ]),
  );

  gameContext.addGameObject(
    new FireBarBlock(gameContext, BLOCK_SIZE * 126, BLOCK_SIZE * 7),
  );

  createBlockWall(gameContext, 129, 13, 1, 4, "coin");
  createBlockWall(gameContext, 129, 17, 1, 1, "wall");
  createBlockWall(gameContext, 133, 17, 15, 1, "wall");
  createBlockWall(gameContext, 132, 0, 1, 14, "wall");
  createBlockWall(gameContext, 137, 5, 1, 12, "wall");

  gameContext.addGameObject(
    new FireCrossBlock(gameContext, BLOCK_SIZE * 132, BLOCK_SIZE * 17, [
      direction.UP,
    ]),
  );

  gameContext.addGameObject(
    new FireCrossBlock(gameContext, BLOCK_SIZE * 136, BLOCK_SIZE * 14, [
      direction.LEFT,
    ]),
  );

  gameContext.addGameObject(
    new FireCrossBlock(gameContext, BLOCK_SIZE * 133, BLOCK_SIZE * 11, [
      direction.RIGHT,
    ]),
  );

  gameContext.addGameObject(
    new FireCrossBlock(gameContext, BLOCK_SIZE * 136, BLOCK_SIZE * 8, [
      direction.LEFT,
    ]),
  );

  gameContext.addGameObject(
    new FireCrossBlock(gameContext, BLOCK_SIZE * 133, BLOCK_SIZE * 5, [
      direction.RIGHT,
    ]),
  );

  createBlockWall(gameContext, 138, 5, 4, 1, "falling-floor");
  createBlockWall(gameContext, 138, 8, 4, 1, "falling-floor");
  createBlockWall(gameContext, 138, 11, 4, 1, "falling-floor");
  createBlockWall(gameContext, 138, 14, 4, 1, "falling-floor");

  createBlockWall(gameContext, 142, 0, 1, 15, "wall");

  gameContext.addGameObject(
    new StacheStalker(gameContext, BLOCK_SIZE * 140, BLOCK_SIZE * 6),
  );

  gameContext.addGameObject(
    new StacheStalker(gameContext, BLOCK_SIZE * 140, BLOCK_SIZE * 9),
  );

  gameContext.addGameObject(
    new StacheStalker(gameContext, BLOCK_SIZE * 140, BLOCK_SIZE * 12),
  );
}

function sectionSix(gameContext: GameContext) {
  for (let i = 0; i < 5; i++) {
    gameContext.addGameObject(
      new StacheCannon(
        gameContext,
        BLOCK_SIZE * 143,
        BLOCK_SIZE * (i * 3 + 2),
        direction.RIGHT,
      ),
    );
  }

  createBlockWall(gameContext, 150, 3, 1, 1, "wall");
  createBlockWall(gameContext, 150, 6, 1, 1, "wall");
  createBlockWall(gameContext, 150, 9, 1, 1, "wall");
  createBlockWall(gameContext, 150, 12, 1, 1, "wall");
  createBlockWall(gameContext, 150, 15, 1, 1, "wall");

  createBlockWall(gameContext, 153, 4, 1, 1, "wall");
  createBlockWall(gameContext, 153, 7, 1, 1, "wall");
  createBlockWall(gameContext, 153, 10, 1, 1, "wall");
  createBlockWall(gameContext, 153, 13, 1, 1, "wall");
  createBlockWall(gameContext, 153, 16, 1, 1, "wall");

  createBlockWall(gameContext, 156, 2, 1, 1, "wall");
  createBlockWall(gameContext, 156, 5, 1, 1, "wall");
  createBlockWall(gameContext, 156, 8, 1, 1, "wall");
  createBlockWall(gameContext, 156, 11, 1, 1, "wall");
  createBlockWall(gameContext, 156, 14, 1, 1, "wall");

  createBlockWall(gameContext, 159, 3, 1, 1, "wall");
  createBlockWall(gameContext, 159, 6, 1, 1, "wall");
  createBlockWall(gameContext, 159, 9, 1, 1, "wall");
  createBlockWall(gameContext, 159, 12, 1, 1, "wall");
  createBlockWall(gameContext, 159, 15, 1, 1, "wall");

  gameContext.addGameObject(
    new StacheStreaker(gameContext, BLOCK_SIZE * 155, 0),
  );
  const enemy = new StacheStreaker(gameContext, BLOCK_SIZE * 152, 0);
  enemy.speedX *= -1;
  gameContext.addGameObject(enemy);

  gameContext.addGameObject(
    new Pipe(gameContext, {
      x: BLOCK_SIZE * 162,
      y: 0,
      height: BLOCK_SIZE * 4,
      hasStacheSeed: true,
      reversed: true,
    }),
  );

  gameContext.addGameObject(
    new Pipe(gameContext, {
      x: BLOCK_SIZE * 162,
      y: BLOCK_SIZE * 10,
      height: BLOCK_SIZE * 8,
      hasStacheSeed: true,
    }),
  );
}

function sectionSeven(gameContext: GameContext) {
  createBlockWall(gameContext, 168, 7, 2, 1, "falling-floor");
  createBlockWall(gameContext, 172, 4, 2, 1, "falling-floor");
  createBlockWall(gameContext, 184, 15, 2, 1, "falling-floor");
  createBlockWall(gameContext, 189, 12, 1, 1, "falling-floor");
  createBlockWall(gameContext, 193, 9, 1, 1, "falling-floor");
  createBlockWall(gameContext, 189, 6, 1, 1, "falling-floor");
  createBlockWall(gameContext, 193, 3, 1, 1, "falling-floor");
  createBlockWall(gameContext, 194, 2, 1, 15, "falling-floor");

  createBlockSquare(gameContext, 198, 7, 10, 6, "falling-floor");
  createBlockWall(gameContext, 199, 8, 8, 4, "coin");

  createBlockWall(gameContext, 208, 17, 32, 1, "wall");
  gameContext.addGameObject(
    new Flag(gameContext, BLOCK_SIZE * 220, BLOCK_SIZE * 9),
    true,
  );
}
