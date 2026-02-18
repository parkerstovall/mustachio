import { BLOCK_SIZE, STREAKER_SPEED } from '../../constants'
import type { GameScene } from '../../scenes/GameScene'
import { Enemy } from './Enemy'
import { Laser } from '../projectiles/Laser'

export class StacheStreaker extends Enemy {
  readonly pointValue = 1250
  private canMove = true
  private totalDistance = 0
  private readonly timeBetweenShots = 3500
  private readonly shotTime = 5000
  private shotTimer: Phaser.Time.TimerEvent | null = null
  acceptsCollision = false

  constructor(scene: GameScene, x: number, y: number) {
    super(scene, x, y, 'stache-streaker-1', false)

    this.setDisplaySize(BLOCK_SIZE * 2, BLOCK_SIZE * 1.5)
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

    this.shotTimer = scene.time.delayedCall(this.timeBetweenShots, () => {
      this.fireLaser()
    })
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta)

    if (!this.isDead && this.canMove) {
      this.totalDistance += Math.abs(this.body.velocity.x) * (delta / 1000)

      if (this.totalDistance >= BLOCK_SIZE * 5) {
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
      this.shotTime,
    )
    this.canMove = false
    this.setVelocityX(0)
    this.nextImage()

    this.shotTimer = this.scene.time.delayedCall(this.shotTime, () => {
      if (this.isDead || !this.active) return
      this.canMove = true
      this.setVelocityX(STREAKER_SPEED)
      this.nextImage()

      this.shotTimer = this.scene.time.delayedCall(
        this.timeBetweenShots,
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
