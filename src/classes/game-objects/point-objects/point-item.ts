import { MovingGameObject } from "../../../shared/game-objects/moving-game-object";

export abstract class PointObject extends MovingGameObject {
  abstract pointValue: number;

  collect() {
    this.gameContext.addScore(this.pointValue);
    this.gameContext.removeGameObject(this);
  }
}
