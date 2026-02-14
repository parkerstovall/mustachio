import type { GameScene, LevelFunction } from '../../scenes/GameScene'
import { Pipe, type PipeOptions } from './Pipe'

export interface WarpPipeOptions extends PipeOptions {
  setNewLevel: LevelFunction
}

export class WarpPipe extends Pipe {
  declare scene: GameScene
  private readonly setNewLevel: LevelFunction

  constructor(scene: GameScene, options: WarpPipeOptions) {
    super(scene, options)
    this.setNewLevel = options.setNewLevel

    // Set up overlap detection for crouching player
    scene.physics.add.overlap(scene.player, this, () => {
      scene.player.setWarpPipe(this)
    })
  }

  enter() {
    const scene = this.scene
    scene.loadLevel(this.setNewLevel, scene.previousLevels)
  }
}
