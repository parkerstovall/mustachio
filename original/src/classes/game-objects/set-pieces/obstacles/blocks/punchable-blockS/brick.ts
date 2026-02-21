import type { GameContext } from '../../../../../../shared/game-context'
import { PunchableBlock } from './punchable-block'
import { BrickDebris } from '../../../../projectiles/brick-debris'
import brickImage from '../../../../../../assets/brick.webp'

export class Brick extends PunchableBlock {
  protected punched = false
  private readonly image: HTMLImageElement = new Image()

  constructor(gameContext: GameContext, x: number, y: number) {
    super(gameContext, x, y)
    this.image.src = brickImage
  }

  punch() {
    if (this.punched) {
      return
    }

    this.punched = true
    this.gameContext.addScore(100)

    const speedXs = [-1, -2.5, 1, 2.5]
    const speedYs = [-2, -3.5, -2, -3.5]
    for (let i = 0; i < 4; i++) {
      const debris = new BrickDebris(this.gameContext, this)
      debris.speedX = speedXs[i]
      debris.speedY = speedYs[i]
      this.gameContext.addGameObject(debris)
    }

    this.gameContext.removeGameObject(this)
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
}
