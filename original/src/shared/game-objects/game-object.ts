import type { GameContext } from '../game-context'
import type { rectangle } from '../types'

export abstract class GameObject {
  acceptsCollision = true

  readonly rect: rectangle
  readonly objectId: number

  protected readonly gameContext: GameContext

  constructor(gameContext: GameContext, rect: rectangle) {
    this.gameContext = gameContext
    this.objectId = this.generateUniqueId()
    this.rect = rect
  }

  abstract draw(ctx: CanvasRenderingContext2D): void

  private generateUniqueId() {
    let id = Math.floor(Math.random() * 10000)
    while (!this.gameContext.validateNewObjectId(id)) {
      id = Math.floor(Math.random() * 10000)
    }

    return id
  }
}
