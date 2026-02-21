import type { GameContext } from '../../../../shared/game-context'
import { Pipe } from './pipe'
import type { WarpPipeOptions } from './obstacle-types'

export class WarpPipe extends Pipe {
  readonly objectId = 0
  readonly setNewLevel: (gameContext: GameContext) => void

  constructor(gameContext: GameContext, options: WarpPipeOptions) {
    super(gameContext, { ...options })
    this.setNewLevel = options.setNewLevel
  }

  enter() {
    this.setNewLevel(this.gameContext)
  }
}
