import { Enemy } from "../point-objects/enemies/enemy";
import { Projectile } from "./projectile";
import type { GameContext } from "../../../shared/game-context";
import type { collision, rectangle } from "../../../shared/types";

export class StacheBall extends Projectile {
  constructor(
    gameContext: GameContext,

    x: number,
    y: number,
  ) {
    const rect: rectangle = {
      x,
      y,
      width: 8,
      height: 8,
    };

    super(gameContext, rect);
  }

  update(collisions: collision[]): void {
    this.leftRightMovement(collisions);

    if (this.onGround) {
      this.speedY = -5.5;
    }

    if (this.rect.x < 0 || this.rect.x > this.gameContext.gameArea.width) {
      this.gameContext.removeGameObject(this);
      return;
    }

    for (const collision of collisions) {
      if (collision.gameObject instanceof Enemy) {
        collision.gameObject.enemyHit();
        this.gameContext.removeGameObject(this);
        return;
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.fillStyle = "red";
    ctx.arc(
      this.rect.x + this.gameContext.xOffset,
      this.rect.y,
      this.rect.height,
      0,
      2 * Math.PI,
    );
    ctx.fill();
  }
}
