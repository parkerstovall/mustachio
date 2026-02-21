import {
  STREAKER_SPEED,
  STREAKER_WIDTH,
  STREAKER_HEIGHT,
  STREAKER_PATROL_DISTANCE,
  STREAKER_SHOT_COOLDOWN,
  STREAKER_SHOT_DURATION,
} from '../../constants'
import type { GameScene } from '../../scenes/GameScene'
import { Enemy } from './Enemy'
import { Laser } from '../projectiles/Laser'

export class StacheStreaker extends Enemy {
  readonly pointValue = 1250
  private canMove = true
  private totalDistance = 0
  private shotTimer: Phaser.Time.TimerEvent | null = null
  acceptsCollision = false

  constructor(scene: GameScene, x: number, y: number) {
    super(scene, x, y, 'stache-streaker-1', false)

    this.setDisplaySize(STREAKER_WIDTH, STREAKER_HEIGHT)
    this.body.setOffset(0, 0)
    this.body.setAllowGravity(false)

    this.imageKeys = ['stache-streaker-1', 'stache-streaker-2']
    this.setVelocityX(STREAKER_SPEED)

    // Remove from enemies group (uses overlap only, not stomp)
    scene.enemies.remove(this)
    // Add overlap with player directly
    scene.physics.add.overlap(scene.player, this, () => {
      if (!this.isDead) {
        scene.player.playerHit()
      }
    })

    this.shotTimer = scene.time.delayedCall(STREAKER_SHOT_COOLDOWN, () => {
      this.fireLaser()
    })
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta)

    if (!this.isDead && this.canMove) {
      this.totalDistance += Math.abs(this.body.velocity.x) * (delta / 1000)

      if (this.totalDistance >= STREAKER_PATROL_DISTANCE) {
        this.setVelocityX(-this.body.velocity.x)
        this.totalDistance = 0
      }
    }
  }

  private fireLaser() {
    if (this.isDead || !this.active) return

    new Laser(
      this.scene,
      this.x,
      this.y,
      this.displayWidth,
      this.displayHeight,
      STREAKER_SHOT_DURATION,
    )
    this.canMove = false
    this.setVelocityX(0)
    this.nextImage()

    this.shotTimer = this.scene.time.delayedCall(STREAKER_SHOT_DURATION, () => {
      if (this.isDead || !this.active) return
      this.canMove = true
      this.setVelocityX(STREAKER_SPEED)
      this.nextImage()

      this.shotTimer = this.scene.time.delayedCall(
        STREAKER_SHOT_COOLDOWN,
        () => {
          this.fireLaser()
        },
      )
    })
  }

  destroy(fromScene?: boolean) {
    if (this.shotTimer) {
      this.shotTimer.remove()
    }
    super.destroy(fromScene)
  }
}
