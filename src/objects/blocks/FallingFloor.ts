import Phaser from 'phaser'
import { BLOCK_SIZE, GAME_HEIGHT } from '../../constants'
import type { GameScene } from '../../scenes/GameScene'

export class FallingFloor extends Phaser.Physics.Arcade.Sprite {
  declare scene: GameScene
  declare body: Phaser.Physics.Arcade.StaticBody
  private fallStarted = false
  private isFalling = false

  constructor(scene: GameScene, x: number, y: number) {
    super(scene, x, y, 'falling-floor-proc')
    scene.add.existing(this)
    scene.breakables.add(this)

    this.setOrigin(0, 0)
    this.setDisplaySize(BLOCK_SIZE, BLOCK_SIZE)
    this.refreshBody()
  }

  startFall() {
    if (this.fallStarted) return
    this.fallStarted = true

    this.scene.time.delayedCall(250, () => {
      this.isFalling = true
      // Convert to dynamic body for falling
      this.scene.breakables.remove(this)
      this.scene.physics.world.remove(this.body)
      this.scene.physics.add.existing(this, false) // dynamic body
      ;(this.body as unknown as Phaser.Physics.Arcade.Body).setAllowGravity(
        false,
      )
      this.setVelocityY(250)
    })
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta)

    if (this.isFalling && this.y > GAME_HEIGHT) {
      this.destroy()
    }
  }
}
