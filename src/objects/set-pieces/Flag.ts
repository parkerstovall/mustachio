import Phaser from 'phaser'
import {
  ABOVE_PLAYER_DEPTH,
  BELOW_PLAYER_DEPTH,
  FLAG_SIZE,
} from '../../constants'
import type { GameScene } from '../../scenes/GameScene'

export class Flag extends Phaser.Physics.Arcade.Sprite {
  declare scene: GameScene

  constructor(scene: GameScene, x: number, y: number) {
    super(scene, x, y, 'homestead')
    scene.add.existing(this)
    scene.physics.add.existing(this, true) // static

    this.setOrigin(0, 0)
    this.setDisplaySize(FLAG_SIZE, FLAG_SIZE)
    this.refreshBody()
    this.setDepth(BELOW_PLAYER_DEPTH)

    // Overlap with player triggers win
    scene.physics.add.overlap(scene.player, this, () => {
      if (!scene.gameOver) {
        scene.player.winGame(this)
      }
    })
  }

  closeDoor() {
    this.setTexture('homestead-closed')
    this.setDepth(ABOVE_PLAYER_DEPTH)
  }
}
