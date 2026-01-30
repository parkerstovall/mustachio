import type { GameContext } from "../../../../shared/game-context";
import type { rectangle } from "../../../../shared/types";
import { PointObject } from "../point-item";
import { BLOCK_SIZE } from "../../../../shared/constants";

export abstract class Item extends PointObject {
  protected readonly fromItemBlock: boolean;

  constructor(
    gameContext: GameContext,

    rect: rectangle,
    fromItemBlock: boolean = false,
  ) {
    if (fromItemBlock) {
      rect.x -= rect.width / 2;
      rect.y += BLOCK_SIZE;
    }

    super(gameContext, rect);

    this.fromItemBlock = fromItemBlock;
    if (fromItemBlock) {
      this.speedY = -0.5;
    }
  }
}
