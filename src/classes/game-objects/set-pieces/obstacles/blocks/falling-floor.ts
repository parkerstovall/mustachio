import { BLOCK_SIZE } from "../../../../../shared/constants";
import type { rectangle } from "../../../../../shared/types";
import { Block } from "./block";

export class FallingFloor extends Block {
  private isFalling: boolean = false;
  private fallStarted: boolean = false;

  startFall() {
    if (this.fallStarted) {
      return;
    }

    this.fallStarted = true;
    setTimeout(() => {
      this.acceptsCollision = false;
      this.isFalling = true;
    }, 250);
  }

  draw(ctx: CanvasRenderingContext2D) {
    // This logic SHOULD be in the update method,
    // but I decided to extend block rather than UpdatingGameObject
    if (this.isFalling) {
      this.rect.y += 5;

      if (this.rect.y > this.gameContext.gameArea.height) {
        this.gameContext.removeGameObject(this);
      }
    }

    ctx.fillStyle = "Bisque";
    ctx.fillRect(
      this.rect.x + this.gameContext.xOffset,
      this.rect.y,
      this.rect.width,
      this.rect.height,
    );

    const seeThroughRect: rectangle = {
      x: this.rect.x + BLOCK_SIZE / 3 + this.gameContext.xOffset,
      y: this.rect.y + BLOCK_SIZE / 3,
      width: this.rect.width - (BLOCK_SIZE / 3) * 2,
      height: this.rect.height - (BLOCK_SIZE / 3) * 2,
    };

    ctx.clearRect(
      seeThroughRect.x,
      seeThroughRect.y,
      seeThroughRect.width,
      seeThroughRect.height,
    );

    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.strokeRect(
      seeThroughRect.x,
      seeThroughRect.y,
      seeThroughRect.width,
      seeThroughRect.height,
    );

    ctx.strokeRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
  }
}
