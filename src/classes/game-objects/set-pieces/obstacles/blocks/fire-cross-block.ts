import type { GameContext } from "../../../../../shared/game-context";
import { Block } from "./block";
import { FireCross } from "../../../projectiles/enemy-projectiles/fire-cross";
import obstacleBrick from "../../../../../assets/obstacleBrick.webp";

export class FireCrossBlock extends Block {
  private readonly image: HTMLImageElement = new Image();

  constructor(gameContext: GameContext, x: number, y: number, dirs: number[]) {
    super(gameContext, x, y);

    this.image.src = obstacleBrick;

    for (const dir of dirs) {
      this.gameContext.addGameObject(new FireCross(gameContext, this, dir));
    }
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
