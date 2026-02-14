import type { GameContext } from '../../../shared/game-context'
import { SetPiece } from './set-piece'
import { BLOCK_SIZE } from '../../../shared/constants'
import homestead from '../../../assets/homestead.webp'
import homesteadClosed from '../../../assets/homesteadClosed.webp'

export class Flag extends SetPiece {
  private readonly image = new Image()

  constructor(gameContext: GameContext, x: number, y: number) {
    super(gameContext, {
      x,
      y,
      width: BLOCK_SIZE * 8,
      height: BLOCK_SIZE * 8,
    })

    this.image.src = homestead
  }

  closeDoor() {
    this.image.src = homesteadClosed
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
