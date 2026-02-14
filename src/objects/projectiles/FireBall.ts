import Phaser from 'phaser'
import {
  FIREBALL_SPEED,
  FIREBALL_TRACKING_SPEED,
  GAME_WIDTH,
  GAME_HEIGHT,
} from '../../constants'
import type { GameScene } from '../../scenes/GameScene'
import type { Enemy } from '../enemies/Enemy'

export class FireBall extends Phaser.Physics.Arcade.Sprite {
  declare scene: GameScene
  declare body: Phaser.Physics.Arcade.Body
  private readonly tracking: boolean

  constructor(scene: GameScene, parent: Enemy) {
    super(
      scene,
      parent.x + parent.displayWidth / 2,
      parent.y + parent.displayHeight + 10,
      'stache-ball',
    )

    scene.add.existing(this)
    scene.physics.add.existing(this)
    scene.enemyProjectiles.add(this)

    this.setOrigin(0.5, 0.5)
    this.setDisplaySize(16, 16)
    this.body.setSize(16, 16)
    this.body.setAllowGravity(false)

    this.tracking = Math.random() < 0.25
    this.setSpeed()

    // Self-destruct after 5s
    scene.time.delayedCall(5000, () => {
      if (this.active) this.destroy()
    })
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta)

    if (this.tracking) {
      this.setSpeed()
    }

    // Destroy if off screen
    const cam = this.scene.cameras.main
    if (
      this.x < cam.scrollX - 100 ||
      this.x > cam.scrollX + GAME_WIDTH + 100 ||
      this.y < -100 ||
      this.y > GAME_HEIGHT + 100
    ) {
      this.destroy()
    }
  }

  private setSpeed() {
    const player = this.scene.player
    if (!player || !player.active) return

    const dx = player.x - this.x
    const dy = player.y - this.y
    const angle = Math.atan2(dy, dx)
    const speed = this.tracking ? FIREBALL_TRACKING_SPEED : FIREBALL_SPEED

    this.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed)
  }
}
