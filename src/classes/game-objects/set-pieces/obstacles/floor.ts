import { BLOCK_SIZE } from "../../../../shared/constants";
import { Obstacle } from "./obstacle";

export class Floor extends Obstacle {
  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "YellowGreen";

    const grassRect = {
      x: this.rect.x + this.gameContext.xOffset,
      y: this.rect.y,
      width: this.rect.width,
      height: BLOCK_SIZE / 3,
    };

    const dirtRect = {
      x: this.rect.x + this.gameContext.xOffset,
      y: this.rect.y + BLOCK_SIZE / 3,
      width: this.rect.width,
      height: BLOCK_SIZE - BLOCK_SIZE / 3,
    };

    ctx.fillRect(grassRect.x, grassRect.y, grassRect.width, grassRect.height);

    ctx.fillStyle = "SaddleBrown";
    ctx.fillRect(dirtRect.x, dirtRect.y, dirtRect.width, dirtRect.height);
  }
}
