import type { GameContext } from "../../../../shared/game-context";
import type { collision, rectangle } from "../../../../shared/types";
import type { FireBarBlock } from "../../set-pieces/obstacles/blocks/fire-bar-block";
import { RotatingGameObject } from "../../../../shared/game-objects/rotating-game-object";

export class FireBar extends RotatingGameObject {
  private readonly anchorBlock: FireBarBlock;

  constructor(
    gameContext: GameContext,

    x: number,
    y: number,
    anchorBlock: FireBarBlock,
  ) {
    const rect: rectangle = {
      x,
      y,
      width: 10,
      height: 250,
    };

    super(gameContext, rect);
    this.anchorBlock = anchorBlock;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(_: collision[]): void {
    this.rotation += this.rotationSpeed;
    this.rotation %= Math.PI * 2;

    const anchorCenterX =
      this.anchorBlock.rect.x + this.anchorBlock.rect.width / 2;
    const anchorCenterY =
      this.anchorBlock.rect.y + this.anchorBlock.rect.height / 2;

    // Position the firebar so its BOTTOM CENTER is at the anchor center
    this.rect.x = anchorCenterX - this.rect.width / 2;
    this.rect.y = anchorCenterY - this.rect.height;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();

    // Move the origin to the bottom-center of the firebar
    ctx.translate(
      this.rect.x + this.rect.width / 2 + this.gameContext.xOffset,
      this.rect.y + this.rect.height,
    );

    // Rotate around the bottom edge
    ctx.rotate(this.rotation);

    // Draw the bar with its bottom edge at the origin
    ctx.fillStyle = "red";
    ctx.fillRect(
      -this.rect.width / 2, // center horizontally
      -this.rect.height, // draw upward from pivot
      this.rect.width,
      this.rect.height,
    );

    ctx.restore();
  }
}
