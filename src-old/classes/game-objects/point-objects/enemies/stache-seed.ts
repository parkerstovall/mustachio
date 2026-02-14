import { direction, type collision } from '../../../../shared/types'
import { Enemy } from './enemy'
import type { GameContext } from '../../../../shared/game-context'
import type { GameObject } from '../../../../shared/game-objects/game-object'
import { BLOCK_SIZE } from '../../../../shared/constants'
import stacheSeed1 from '../../../../assets/stacheSeed1.webp'
import stacheSeed2 from '../../../../assets/stacheSeed2.webp'
import stacheSeedReversed1 from '../../../../assets/stacheSeedReversed1.webp'
import stacheSeedReversed2 from '../../../../assets/stacheSeedReversed2.webp'

export class StacheSeed extends Enemy {
  readonly pointValue: number = 100
  inPipe: boolean = false

  private direction: number
  private readonly parent: GameObject
  private readonly waitTime: number = 2500
  private readonly reversed: boolean

  constructor(gameContext: GameContext, parent: GameObject, reversed: boolean) {
    const width = BLOCK_SIZE * 1
    const height = BLOCK_SIZE * 3

    let x: number
    let y: number

    if (reversed) {
      x = parent.rect.x + parent.rect.width / 2 - width / 2
      y = parent.rect.y + parent.rect.height - height
    } else {
      x = parent.rect.x + parent.rect.width / 2 - width / 2
      y = parent.rect.y
    }

    super(gameContext, {
      x,
      y,
      width,
      height,
    })

    this.reversed = reversed
    this.parent = parent
    this.speedY = 1.5
    if (reversed) {
      this.direction = direction.DOWN
      this.imageSources.push(stacheSeedReversed1, stacheSeedReversed2)
    } else {
      this.direction = direction.UP
      this.imageSources.push(stacheSeed1, stacheSeed2)
    }
  }

  // collisions with this enemy are handled by the player class
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(_: collision[]): void {
    if (this.direction === direction.UP) {
      this.rect.y -= this.speedY

      if (this.shouldChangeDirection()) {
        this.direction = direction.NONE
        if (this.reversed) {
          this.inPipe = true
        }

        setTimeout(() => {
          this.inPipe = false
          this.direction = direction.DOWN
        }, this.waitTime)
      }
    } else if (this.direction === direction.DOWN) {
      this.rect.y += this.speedY

      if (this.shouldChangeDirection()) {
        this.direction = direction.NONE
        if (!this.reversed) {
          this.inPipe = true
        }

        setTimeout(() => {
          this.inPipe = false
          this.direction = direction.UP
        }, this.waitTime)
      }
    }

    if (this.rect.y < 0) {
      this.isDead = true
    }
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

  private shouldChangeDirection(): boolean {
    if (this.reversed) {
      if (this.direction === direction.UP) {
        return (
          this.rect.y + this.rect.height <
          this.parent.rect.y + this.parent.rect.height
        )
      }
      if (this.direction === direction.DOWN) {
        return this.rect.y > this.parent.rect.y + this.parent.rect.height
      }
    } else {
      if (this.direction === direction.UP) {
        return this.rect.y + this.rect.height < this.parent.rect.y
      }
      if (this.direction === direction.DOWN) {
        return this.rect.y > this.parent.rect.y
      }
    }

    return false
  }
}
