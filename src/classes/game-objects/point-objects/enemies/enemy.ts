import type { rectangle } from "../../../../shared/types";
import { PointObject } from "../point-item";
import type { GameContext } from "../../../../shared/game-context";

export abstract class Enemy extends PointObject {
  isDead: boolean = false;
  protected image: HTMLImageElement = new Image();
  protected imageSources: string[] = [];
  protected imageSourceIndex: number = 0;
  protected shotTimer: number | null = null;
  private imageTimer: number | null = null;

  constructor(
    gameContext: GameContext,
    rect: rectangle,
    useBothImages: boolean = true,
  ) {
    super(gameContext, rect);

    if (useBothImages) {
      this.imageTimer = setInterval(() => {
        this.setNextImage();
      }, 250);
    }
  }

  setNextImage() {
    this.imageSourceIndex++;
    if (this.imageSourceIndex >= this.imageSources.length) {
      this.imageSourceIndex = 0;
    }
    this.image.src = this.imageSources[this.imageSourceIndex];
  }

  enemyHit() {
    if (this.isDead) {
      return;
    }

    this.isDead = true;
    this.speedX = 0;
    this.speedY = 0;
    this.rect.y += this.rect.height / 2;
    this.rect.height /= 2;
    this.gameContext.addScore(this.pointValue);

    setTimeout(() => {
      this.gameContext.removeGameObject(this);
    }, 500);
  }

  dispose() {
    if (this.shotTimer) {
      clearTimeout(this.shotTimer);
      clearInterval(this.shotTimer);
      this.shotTimer = null;
    }

    if (this.imageTimer) {
      clearInterval(this.imageTimer);
      this.imageTimer = null;
    }
  }
}
