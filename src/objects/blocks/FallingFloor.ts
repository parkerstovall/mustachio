import Phaser from 'phaser'
import {
  BLOCK_SIZE,
  FALLING_FLOOR_PRE_FALL_DELAY,
  FALLING_FLOOR_FALL_DURATION,
} from '../../constants'
import type { GameScene } from '../../scenes/GameScene'

export class FallingFloor extends Phaser.Physics.Arcade.Sprite {
  declare scene: GameScene
  declare body: Phaser.Physics.Arcade.Body
  private fallStarted = false

  constructor(scene: GameScene, x: number, y: number) {
    super(scene, x, y, 'falling-floor-proc')
    scene.add.existing(this)
    scene.fallingFloors.add(this)

    this.setOrigin(0, 0)
    this.setDisplaySize(BLOCK_SIZE, BLOCK_SIZE)
    this.setImmovable(true)
    this.body.setAllowGravity(false)
    this.refreshBody()
  }

  startFall() {
    if (this.fallStarted) return
    this.fallStarted = true

    this.scene.time.delayedCall(FALLING_FLOOR_PRE_FALL_DELAY, () => {
      this.body.setAllowGravity(true)
      this.scene.time.delayedCall(FALLING_FLOOR_FALL_DURATION, () => {
        this.destroy()
      })
    })
  }
}
