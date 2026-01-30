import type { collision } from "../../../shared/types";
import type { Brick } from "../set-pieces/obstacles/blocks/punchable-blockS/brick";
import type { GameContext } from "../../../shared/game-context";
import { Projectile } from "./projectile";

export class BrickDebris extends Projectile {
  readonly acceptsCollision = false;

  constructor(gameContext: GameContext, parent: Brick) {
    super(gameContext, {
      x: parent.rect.x + parent.rect.width / 2,
      y: parent.rect.y + parent.rect.height / 2,
      width: 8,
      height: 8,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(_: collision[]): void {
    this.rect.x += this.speedX;
    this.rect.y += this.speedY;
    this.speedY += this.gameContext.gravity;

    if (this.rect.y > this.gameContext.gameArea.height) {
      this.gameContext.removeGameObject(this);
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "brown";

    ctx.beginPath();
    ctx.arc(
      this.rect.x + this.rect.width / 2 + this.gameContext.xOffset,
      this.rect.y + this.rect.height / 2,
      this.rect.width,
      0,
      Math.PI * 2,
    );

    ctx.fill();
    ctx.closePath();
  }
}
