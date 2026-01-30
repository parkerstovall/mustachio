import type { GameContext } from "../../../../../shared/game-context";
import { Block } from "./block";
import { direction } from "../../../../../shared/types";
import { StacheShot } from "../../../point-objects/enemies/stache-shot";
import { outOfBounds } from "../../../../../shared/app-code";
import stacheCannonUp from "../../../../../assets/cannonUp.webp";
import stacheCannonDown from "../../../../../assets/cannonDown.webp";
import stacheCannonLeft from "../../../../../assets/cannonLeft.webp";
import stacheCannonRight from "../../../../../assets/cannonRight.webp";

export class StacheCannon extends Block {
  private readonly image: HTMLImageElement = new Image();
  private readonly shotTimer: number;

  constructor(gameContext: GameContext, x: number, y: number, dir: number) {
    super(gameContext, x, y);
    if (dir === direction.UP) {
      this.image.src = stacheCannonUp;
    } else if (dir === direction.DOWN) {
      this.image.src = stacheCannonDown;
    } else if (dir === direction.LEFT) {
      this.image.src = stacheCannonLeft;
    } else if (dir === direction.RIGHT) {
      this.image.src = stacheCannonRight;
    } else {
      throw new Error("Invalid direction for StacheCannon");
    }

    this.shotTimer = setInterval(() => {
      if (outOfBounds(this, this.gameContext)) {
        return;
      }

      this.gameContext.addGameObject(
        new StacheShot(this.gameContext, this, dir),
        true,
      );
    }, 6000);
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

  dispose() {
    clearInterval(this.shotTimer);
  }
}
