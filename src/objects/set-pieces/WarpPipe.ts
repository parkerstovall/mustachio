import type { GameScene, LevelFunction } from '../../scenes/GameScene'
import { Pipe, type PipeOptions } from './Pipe'

export interface WarpPipeOptions extends PipeOptions {
  setNewLevel: LevelFunction
}

export class WarpPipe extends Pipe {
  declare scene: GameScene
  declare body: Phaser.Physics.Arcade.Body
  private readonly setNewLevel: LevelFunction

  constructor(scene: GameScene, options: WarpPipeOptions) {
    super(scene, options)
    this.setNewLevel = options.setNewLevel
    scene.platforms.remove(this)

    // Set up overlap detection for crouching player
    scene.physics.add.collider(scene.player, this, () => {
      if (scene.player.body.blocked.down && this.body.touching.up) {
        scene.player.setWarpPipe(this)
      }
    })
  }

  enter() {
    const scene = this.scene
    scene.loadLevel(this.setNewLevel, scene.previousLevels)
  }
}
