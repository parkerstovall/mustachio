import type { collision, rectangle } from '../../../../shared/types'
import { Enemy } from './enemy'
import type { GameContext } from '../../../../shared/game-context'
import { BLOCK_SIZE } from '../../../../shared/constants'
import stacheStalker from '../../../../assets/stacheStalker.webp'
import stacheStalkerReversed from '../../../../assets/stacheStalkerReversed.webp'

export class StacheStalker extends Enemy {
  readonly pointValue: number = 100

  constructor(gameContext: GameContext, x: number, y: number) {
    const rect: rectangle = {
      x,
      y,
      width: BLOCK_SIZE * 0.75,
      height: BLOCK_SIZE * 0.75,
    }
    super(gameContext, rect)

    this.imageSources.push(stacheStalker, stacheStalkerReversed)

    this.image.src = this.imageSources[0]
    this.speedX = 1
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(
      this.image,
      this.rect.x + this.gameContext.xOffset,
      this.rect.y,
      this.rect.width,
      this.rect.height,
    )
  }

  update(collisions: collision[]): void {
    if (!this.isDead) {
      this.leftRightMovement(collisions)
    }
  }
}
