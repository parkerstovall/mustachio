import type { GameContext } from '../../../../shared/game-context'
import type { collision } from '../../../../shared/types'
import { EnemyProjectile } from './enemy-projectile'
import type { Enemy } from '../../point-objects/enemies/enemy'
import { BLOCK_SIZE } from '../../../../shared/constants'

export class Laser extends EnemyProjectile {
  constructor(gameContext: GameContext, parent: Enemy, shotTime: number) {
    const width = BLOCK_SIZE * 0.5
    const height = gameContext.gameArea.height
    const x = parent.rect.x + parent.rect.width / 2 - width / 2
    const y = parent.rect.y + parent.rect.height

    super(gameContext, {
      x,
      y,
      width,
      height,
    })

    setTimeout(() => {
      this.gameContext.removeGameObject(this)
    }, shotTime)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(_: collision[]): void {}

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'blue'
    ctx.fillRect(
      this.rect.x + this.gameContext.xOffset,
      this.rect.y,
      this.rect.width,
      this.rect.height,
    )
    ctx.strokeStyle = 'black'
    ctx.lineWidth = 2
    ctx.strokeRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height)
  }
}
