import type { collision } from '../../../../shared/types'
import { Enemy } from './enemy'
import type { GameContext } from '../../../../shared/game-context'
import { BLOCK_SIZE } from '../../../../shared/constants'
import { FireBall } from '../../projectiles/enemy-projectiles/fire-ball'
import stacheSlinger1 from '../../../../assets/stacheSlinger1.webp'
import stacheSlinger2 from '../../../../assets/stacheSlinger2.webp'

export class StacheSlinger extends Enemy {
  readonly pointValue: number = 1250
  private readonly maxX: number
  private readonly minX: number
  private totalDistance: number = 0

  constructor(gameContext: GameContext, x: number, y: number) {
    super(gameContext, {
      x,
      y,
      width: BLOCK_SIZE * 1.5,
      height: BLOCK_SIZE * 2,
    })

    this.maxX = x + BLOCK_SIZE * 4
    this.minX = x - BLOCK_SIZE * 4

    this.imageSources.push(stacheSlinger1, stacheSlinger2)

    this.image.src = this.imageSources[0]
    this.speedX = 1.5
    gameContext.addGameObject(new FireBall(this.gameContext, this))

    this.shotTimer = setInterval(() => {
      gameContext.addGameObject(new FireBall(this.gameContext, this))
    }, 5000)
  }

  // This enemy doesn't collide with anything
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(_: collision[]): void {
    if (!this.isDead) {
      this.rect.x += this.speedX
      this.totalDistance += this.speedX

      if (this.totalDistance >= this.maxX) {
        this.speedX = -Math.abs(this.speedX)
        this.image.src = this.imageSources[1]
      } else if (this.totalDistance <= this.minX) {
        this.speedX = Math.abs(this.speedX)
        this.image.src = this.imageSources[0]
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.drawImage(
      this.image,
      this.rect.x + this.gameContext.xOffset,
      this.rect.y,
      this.rect.width,
      this.rect.height,
    )
  }
}
