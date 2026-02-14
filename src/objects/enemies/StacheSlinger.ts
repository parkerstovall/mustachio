import { BLOCK_SIZE, SLINGER_SPEED } from '../../constants'
import type { GameScene } from '../../scenes/GameScene'
import { Enemy } from './Enemy'
import { FireBall } from '../projectiles/FireBall'

export class StacheSlinger extends Enemy {
  readonly pointValue = 1250
  private readonly maxX: number
  private readonly minX: number
  private totalDistance = 0
  private shotTimer: Phaser.Time.TimerEvent | null = null

  constructor(scene: GameScene, x: number, y: number) {
    super(scene, x, y, 'stache-slinger-1')

    this.setDisplaySize(BLOCK_SIZE * 1.5, BLOCK_SIZE * 2)
    this.body.setSize(BLOCK_SIZE * 1.5, BLOCK_SIZE * 2)
    this.body.setOffset(0, 0)
    this.body.setAllowGravity(false)

    this.maxX = x + BLOCK_SIZE * 4
    this.minX = x - BLOCK_SIZE * 4

    this.imageKeys = ['stache-slinger-1', 'stache-slinger-2']
    this.setVelocityX(SLINGER_SPEED)

    // Fire initial fireball
    new FireBall(scene, this)

    // Fire on interval
    this.shotTimer = scene.time.addEvent({
      delay: 5000,
      loop: true,
      callback: () => {
        if (!this.isDead && this.active) {
          new FireBall(scene, this)
        }
      },
    })
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta)

    if (!this.isDead) {
      this.totalDistance += this.body.velocity.x * (delta / 1000)

      if (this.x > this.maxX) {
        this.setVelocityX(-SLINGER_SPEED)
        this.setTexture('stache-slinger-2')
        this.setDisplaySize(BLOCK_SIZE * 1.5, BLOCK_SIZE * 2)
      } else if (this.x < this.minX) {
        this.setVelocityX(SLINGER_SPEED)
        this.setTexture('stache-slinger-1')
        this.setDisplaySize(BLOCK_SIZE * 1.5, BLOCK_SIZE * 2)
      }
    }
  }

  destroy(fromScene?: boolean) {
    if (this.shotTimer) {
      this.shotTimer.remove()
    }
    super.destroy(fromScene)
  }
}
