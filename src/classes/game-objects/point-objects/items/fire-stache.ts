import type { GameContext } from "../../../../shared/game-context";
import type { collision, rectangle } from "../../../../shared/types";
import { Item } from "./item";

export class FireStache extends Item {
  readonly pointValue: number = 1000;
  totalRaise: number = 20;
  speedX = 2;

  constructor(
    gameContext: GameContext,

    x: number,
    y: number,
    fromItemBlock: boolean = false,
  ) {
    const rect: rectangle = {
      x,
      y,
      width: 20,
      height: 20,
    };

    super(gameContext, rect, fromItemBlock);
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

  update(collisions: collision[]): void {
    // The animation only happens if the coin
    // is triggered from an item block
    if (this.fromItemBlock && this.totalRaise > 0) {
      this.rect.y += this.speedY;
      this.totalRaise += this.speedY;
      return;
    }

    this.leftRightMovement(collisions);
  }
}
