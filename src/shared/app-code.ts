import type { GameContext } from "./game-context";
import type { GameObject } from "./game-objects/game-object";
import { direction } from "./types";
import { Player } from "./player";

export function collisionDetection(
  go1: GameObject,
  go2: GameObject,
  xOffset: number,
) {
  const rect1 = go1.rect;
  const rect2 = go2.rect;

  let x = rect1.x;
  if (!(go1 instanceof Player)) {
    x += xOffset;
  }

  let x2 = rect2.x;
  if (!(go2 instanceof Player)) {
    x2 += xOffset;
  }

  return (
    x < x2 + rect2.width &&
    x + rect1.width > x2 &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}

export function getCollisionDirection(
  go1: GameObject,
  go2: GameObject,
  xOffset: number,
): number | null {
  if (!collisionDetection(go1, go2, xOffset)) {
    return null;
  }

  const rect1 = go1.rect;
  const rect2 = go2.rect;

  let x = rect1.x;
  if (!(go1 instanceof Player)) {
    x += xOffset;
  }

  let x2 = rect2.x;
  if (!(go2 instanceof Player)) {
    x2 += xOffset;
  }

  const dx = x + rect1.width / 2 - (x2 + rect2.width / 2);
  const dy = rect1.y + rect1.height / 2 - (rect2.y + rect2.height / 2);

  const width = (rect1.width + rect2.width) / 2;
  const height = (rect1.height + rect2.height) / 2;

  const crossWidth = width * dy;
  const crossHeight = height * dx;

  if (Math.abs(dx) <= width && Math.abs(dy) <= height) {
    if (crossWidth > crossHeight) {
      return crossWidth > -crossHeight ? direction.UP : direction.LEFT;
    } else {
      return crossWidth > -crossHeight ? direction.RIGHT : direction.DOWN;
    }
  }

  return null;
}

export function getReverseDirection(dir: number) {
  switch (dir) {
    case direction.UP:
      return direction.DOWN;
    case direction.DOWN:
      return direction.UP;
    case direction.LEFT:
      return direction.RIGHT;
    case direction.RIGHT:
      return direction.LEFT;
    default:
      return direction.NONE;
  }
}

export function outOfBounds(go: GameObject, gameContext: GameContext) {
  const maxX = gameContext.gameArea.width * 2;
  const minX = -gameContext.gameArea.width / 2;
  const maxY = gameContext.gameArea.height;
  const minY = -gameContext.gameArea.height / 2;

  let x = go.rect.x;
  if (!(go instanceof Player)) {
    x += gameContext.xOffset;
  }

  return (
    x + go.rect.width < minX ||
    x > maxX ||
    go.rect.y + go.rect.height < minY ||
    go.rect.y > maxY
  );
}
