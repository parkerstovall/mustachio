import Phaser from 'phaser'
import {
  FIREBALL_SPEED,
  FIREBALL_TRACKING_SPEED,
  GAME_WIDTH,
  GAME_HEIGHT,
  PROJECTILE_SIZE,
  PROJECTILE_CULL_MARGIN,
  FIREBALL_SPAWN_Y_OFFSET,
  FIREBALL_TRACKING_CHANCE,
  FIREBALL_LIFETIME,
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
      parent.y + parent.displayHeight + FIREBALL_SPAWN_Y_OFFSET,
      'stache-ball',
    )

    scene.add.existing(this)
    scene.physics.add.existing(this)
    scene.enemyProjectiles.add(this)

    this.setOrigin(0.5, 0.5)
    this.setDisplaySize(PROJECTILE_SIZE, PROJECTILE_SIZE)
    this.body.setAllowGravity(false)

    this.tracking = Math.random() < FIREBALL_TRACKING_CHANCE
    this.setSpeed()

    // Self-destruct after lifetime
    scene.time.delayedCall(FIREBALL_LIFETIME, () => {
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
      this.x < cam.scrollX - PROJECTILE_CULL_MARGIN ||
      this.x > cam.scrollX + GAME_WIDTH + PROJECTILE_CULL_MARGIN ||
      this.y < -PROJECTILE_CULL_MARGIN ||
      this.y > GAME_HEIGHT + PROJECTILE_CULL_MARGIN
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
