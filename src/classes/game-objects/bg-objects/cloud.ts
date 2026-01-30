import type { GameContext } from "../../../shared/game-context";
import { UpdatingGameObject } from "../../../shared/game-objects/updating-game-object";
import type { collision } from "../../../shared/types";

export class Cloud extends UpdatingGameObject {
  private readonly speed = 0.3;
  constructor(gameContext: GameContext, x: number, y: number) {
    super(gameContext, {
      width: 100,
      height: 60,
      x: x,
      y: y,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(_: collision[]): void {
    this.rect.x -= this.speed;

    // Reset position if the cloud goes off-screen
    if (this.rect.x + this.rect.width < 0) {
      this.rect.x = this.gameContext.gameArea.width;
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "#FFFFFF"; // White color for the cloud
    ctx.beginPath();

    // Draw a simple cloud shape
    ctx.arc(this.rect.x, this.rect.y - 20, 25, 0, 360);
    ctx.arc(this.rect.x + 20, this.rect.y, 25, 0, 360);
    ctx.arc(this.rect.x - 20, this.rect.y, 25, 0, 360);
    ctx.closePath();
    ctx.fill();
  }
}
