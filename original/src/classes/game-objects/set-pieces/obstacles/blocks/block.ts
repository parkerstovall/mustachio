import { BLOCK_SIZE } from '../../../../../shared/constants'
import type { GameContext } from '../../../../../shared/game-context'
import type { rectangle } from '../../../../../shared/types'
import { Obstacle } from '../obstacle'

export abstract class Block extends Obstacle {
  constructor(gameContext: GameContext, x: number, y: number) {
    const rect: rectangle = {
      x,
      y,
      width: BLOCK_SIZE,
      height: BLOCK_SIZE,
    }

    super(gameContext, rect)
  }
}
