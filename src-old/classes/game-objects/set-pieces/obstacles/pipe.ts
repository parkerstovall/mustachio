import { Obstacle } from './obstacle'
import type { GameContext } from '../../../../shared/game-context'
import { StacheSeed } from '../../point-objects/enemies/stache-seed'
import { BLOCK_SIZE } from '../../../../shared/constants'
import type { PipeOptions } from './obstacle-types'

export class Pipe extends Obstacle {
  constructor(
    gameContext: GameContext,
    { x, y, width, height, hasStacheSeed, reversed }: PipeOptions,
  ) {
    super(gameContext, {
      x,
      y,
      width: width ?? BLOCK_SIZE * 2,
      height: height ?? BLOCK_SIZE * 2,
    })

    if (hasStacheSeed) {
      gameContext.addGameObject(
        new StacheSeed(gameContext, this, reversed ?? false),
      )
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'green'
    ctx.fillRect(
      this.rect.x + this.gameContext.xOffset,
      this.rect.y,
      this.rect.width,
      this.rect.height,
    )
  }
}
