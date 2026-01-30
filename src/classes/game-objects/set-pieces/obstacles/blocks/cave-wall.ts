import type { GameContext } from "../../../../../shared/game-context";
import { Block } from "./block";
import type { rectangle } from "../../../../../shared/types";

export class CaveWall extends Block {
  constructor(gameContext: GameContext, rect: rectangle) {
    super(gameContext, rect.x, rect.y);
    this.rect.width = rect.width;
    this.rect.height = rect.height;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "DarkSlateGray";
    ctx.fillRect(
      this.rect.x + this.gameContext.xOffset,
      this.rect.y,
      this.rect.width,
      this.rect.height,
    );
  }
}
