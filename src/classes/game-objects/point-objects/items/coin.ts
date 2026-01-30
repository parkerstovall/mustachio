import type { GameContext } from "../../../../shared/game-context";
import type { collision, rectangle } from "../../../../shared/types";
import { Item } from "./item";
import { BLOCK_SIZE } from "../../../../shared/constants";

export class Coin extends Item {
  readonly pointValue: number = 100;

  constructor(
    gameContext: GameContext,

    x: number,
    y: number,
    fromItemBlock: boolean = false,
  ) {
    const rect: rectangle = {
      x,
      y,
      width: 15,
      height: 15,
    };

    if (!fromItemBlock) {
      rect.x += BLOCK_SIZE / 2 - rect.width / 2;
      rect.y += BLOCK_SIZE / 2 - rect.height / 2;
    }

    super(gameContext, rect, fromItemBlock);

    if (fromItemBlock) {
      this.speedY = -2.5;
    }
  }

  // The coin doesn't care about collisions
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(_collisions: collision[]): void {
    // The animation only happens if the coin
    // is triggered from an item block
    if (!this.fromItemBlock) {
      return;
    }

    if (this.speedY < 0) {
      this.rect.y += this.speedY;
      this.speedY += 0.1;
      return;
    }

    // Once the animation is done, we remove the coin
    this.collect();
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "gold";

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
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}
