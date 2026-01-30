import type { GameContext } from "../../../shared/game-context";
import { UIObject } from "./ui-object";

export class WinDisplay extends UIObject {
  constructor(gameContext: GameContext) {
    super(
      gameContext,
      gameContext.gameArea.width / 2,
      gameContext.gameArea.height / 2 - 50,
    );
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "white";
    ctx.font = "80px Arial";
    const text = `You win! Score: ${this.gameContext.score}`;
    const textWidth = ctx.measureText(text).width;

    ctx.fillText(
      text,
      this.rect.x + this.rect.width / 2 - textWidth / 2,
      this.rect.y + this.rect.height,
    );
  }
}
