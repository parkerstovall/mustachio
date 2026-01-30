import type { GameContext } from "../../../../shared/game-context";
import type { FireCrossBlock } from "../../set-pieces/obstacles/blocks/fire-cross-block";
import { EnemyProjectile } from "./enemy-projectile";
import { BLOCK_SIZE } from "../../../../shared/constants";
import { direction, type collision } from "../../../../shared/types";

export class FireCross extends EnemyProjectile {
  private readonly direction: number;
  private readonly maxLength = BLOCK_SIZE * 4;
  private readonly minLength = BLOCK_SIZE * 0.5;

  constructor(gameContext: GameContext, parent: FireCrossBlock, dir: number) {
    const offset = BLOCK_SIZE * 0.25;
    const width = BLOCK_SIZE * 0.5;
    const height = BLOCK_SIZE * 0.5;
    const x = parent.rect.x + parent.rect.width / 2 - offset;
    const y = parent.rect.y + parent.rect.height / 2 - offset;

    super(gameContext, {
      x,
      y,
      width,
      height,
    });

    this.speedY = 0.75;
    this.speedX = 0.75;

    this.direction = dir;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(_: collision[]): void {
    if (this.direction === direction.LEFT) {
      this.rect.x -= this.speedX;
      this.rect.width += this.speedX;
    } else if (this.direction === direction.RIGHT) {
      this.rect.width += this.speedX;
    } else if (this.direction === direction.UP) {
      this.rect.y -= this.speedY;
      this.rect.height += this.speedY;
    } else if (this.direction === direction.DOWN) {
      this.rect.height += this.speedY;
    }

    if (this.rect.width > this.maxLength || this.rect.height > this.maxLength) {
      this.speedX = -Math.abs(this.speedX);
      this.speedY = -Math.abs(this.speedY);
    } else if (
      this.rect.width < this.minLength ||
      this.rect.height < this.minLength
    ) {
      this.speedX = Math.abs(this.speedX);
      this.speedY = Math.abs(this.speedY);
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "red";
    ctx.fillRect(
      this.rect.x + this.gameContext.xOffset,
      this.rect.y,
      this.rect.width,
      this.rect.height,
    );
  }
}
