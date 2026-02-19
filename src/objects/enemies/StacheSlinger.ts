import {
  SLINGER_SPEED,
  SLINGER_WIDTH,
  SLINGER_HEIGHT,
  SLINGER_PATROL_RANGE,
  SLINGER_SHOT_INTERVAL,
} from '../../constants'
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

    this.setDisplaySize(SLINGER_WIDTH, SLINGER_HEIGHT)
    this.body.setOffset(0, 0)
    this.body.setAllowGravity(false)

    this.maxX = x + SLINGER_PATROL_RANGE
    this.minX = x - SLINGER_PATROL_RANGE

    this.imageKeys = ['stache-slinger-1', 'stache-slinger-2']
    this.setVelocityX(SLINGER_SPEED)

    // Fire initial fireball
    new FireBall(scene, this)

    // Fire on interval
    this.shotTimer = scene.time.addEvent({
      delay: SLINGER_SHOT_INTERVAL,
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
        this.setDisplaySize(SLINGER_WIDTH, SLINGER_HEIGHT)
      } else if (this.x < this.minX) {
        this.setVelocityX(SLINGER_SPEED)
        this.setTexture('stache-slinger-1')
        this.setDisplaySize(SLINGER_WIDTH, SLINGER_HEIGHT)
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
