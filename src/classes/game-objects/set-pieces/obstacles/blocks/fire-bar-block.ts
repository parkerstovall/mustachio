import type { GameContext } from "../../../../../shared/game-context";
import { Block } from "./block";
import { FireBar } from "../../../projectiles/enemy-projectiles/fire-bar";
import obstacleBrick from "../../../../../assets/obstacleBrick.webp";

export class FireBarBlock extends Block {
  private readonly image: HTMLImageElement = new Image();
  constructor(gameContext: GameContext, x: number, y: number) {
    super(gameContext, x, y);

    this.image.src = obstacleBrick;
    const fireBar = new FireBar(
      gameContext,
      this.rect.x + this.rect.width / 2 - 5,
      this.rect.y + this.rect.height / 2 - 50,
      this,
    );

    this.gameContext.addGameObject(fireBar);
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(
      this.image,
      this.rect.x + this.gameContext.xOffset,
      this.rect.y,
      this.rect.width,
      this.rect.height,
    );
  }
}
