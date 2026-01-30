import type { GameContext } from "../../../../../shared/game-context";
import { Block } from "./block";
import obstacleBrick from "../../../../../assets/obstacleBrick.webp";

export class Wall extends Block {
  private readonly image: HTMLImageElement = new Image();

  constructor(gameContext: GameContext, x: number, y: number) {
    super(gameContext, x, y);
    this.image.src = obstacleBrick;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(
      this.image,
      this.rect.x + this.gameContext.xOffset,
      this.rect.y,
      this.rect.width,
      this.rect.height,
    );
  }
}
