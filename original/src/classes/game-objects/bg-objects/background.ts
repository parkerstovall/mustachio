import type { GameContext } from '../../../shared/game-context'
import { GameObject } from '../../../shared/game-objects/game-object'

export class Background extends GameObject {
  constructor(gameContext: GameContext) {
    super(gameContext, {
      width: gameContext.gameArea.width,
      height: gameContext.gameArea.height,
      x: 0,
      y: 0,
    })
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = '#87CEEB' // Sky blue color
    ctx.fillRect(0, 0, this.rect.width, this.rect.height)
  }
}
