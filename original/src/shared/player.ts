import type { GameContext } from './game-context'
import { GameObject } from './game-objects/game-object'
import { MovingGameObject } from './game-objects/moving-game-object'
import { direction, type rectangle } from './types'

export abstract class Player extends MovingGameObject {
  protected ignoreUpdate = false
  isDead: boolean = false
  blockedDirHor: number = direction.NONE
  blockedDirVert: number = direction.NONE
  speedX: number = 0
  speedY: number = 0
  numJumps = 0

  protected readonly gameContext: GameContext

  constructor(gameContext: GameContext, rect: rectangle) {
    super(gameContext, rect)

    this.gameContext = gameContext
  }

  protected handleGravity() {
    if (this.blockedDirVert !== direction.DOWN) {
      this.speedY += this.gameContext.gravity
      this.rect.y += this.speedY
      // if (this.speedY > this.maxSpeedY) {
      //   this.speedY = this.maxSpeedY
      // }

      // Fall off the screen
      if (this.rect.y + this.rect.height >= this.gameContext.gameArea.height) {
        this.playerKill()
      }
    }
  }

  canMove(dir: number) {
    return (
      !this.ignoreUpdate &&
      !this.isDead &&
      (this.blockedDirHor === direction.NONE || this.blockedDirHor !== dir)
    )
  }

  jump() {
    if (this.numJumps >= 2) {
      return
    }

    this.speedY = -14
    this.numJumps++
    this.blockedDirVert = direction.NONE
    this.rect.y -= 5
  }

  landOnGameObject(gameObject: GameObject) {
    this.blockedDirVert = direction.DOWN
    this.rect.y = gameObject.rect.y - this.rect.height + 1
    this.numJumps = 0
    this.speedY = 0
  }

  abstract playerHit(): void

  abstract playerKill(): void

  abstract customKeyDown(key: string): void

  abstract customKeyUp(key: string): void

  abstract reset(x?: number, y?: number): void
}
