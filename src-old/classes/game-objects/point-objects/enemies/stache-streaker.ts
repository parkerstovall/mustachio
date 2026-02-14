import type { collision } from '../../../../shared/types'
import { Enemy } from './enemy'
import type { GameContext } from '../../../../shared/game-context'
import { BLOCK_SIZE } from '../../../../shared/constants'
import { Laser } from '../../projectiles/enemy-projectiles/laser'
import stacheStreaker1 from '../../../../assets/stacheStreaker1.webp'
import stacheStreaker2 from '../../../../assets/stacheStreaker2.webp'

export class StacheStreaker extends Enemy {
  readonly pointValue: number = 1250
  private canMove: boolean = true
  private totalDistance: number = 0
  private readonly timeBetweenShots: number = 3500
  private readonly shotTime: number = 5000

  constructor(gameContext: GameContext, x: number, y: number) {
    super(
      gameContext,
      {
        x,
        y,
        width: BLOCK_SIZE * 2,
        height: BLOCK_SIZE * 1.5,
      },
      false,
    )

    this.imageSources.push(stacheStreaker1, stacheStreaker2)

    this.image.src = this.imageSources[0]
    this.speedX = 1
    this.shotTimer = setTimeout(() => {
      this.fireLaser()
    }, this.timeBetweenShots)
  }

  // This enemy doesn't collide with anything
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(_: collision[]): void {
    if (!this.isDead && this.canMove) {
      this.rect.x += this.speedX
      this.totalDistance += Math.abs(this.speedX)

      if (this.totalDistance >= BLOCK_SIZE * 5) {
        this.speedX *= -1
        this.totalDistance = 0
        //this.setNextImage()
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

  private fireLaser(): void {
    this.gameContext.addGameObject(
      new Laser(this.gameContext, this, this.shotTime),
    )
    this.canMove = false
    this.setNextImage()

    this.shotTimer = setTimeout(() => {
      this.canMove = true
      this.setNextImage()

      this.shotTimer = setTimeout(() => {
        this.fireLaser()
      }, this.timeBetweenShots)
    }, this.shotTime)
  }
}
