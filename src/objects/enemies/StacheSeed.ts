import Phaser from 'phaser'
import { BLOCK_SIZE, STACHE_SEED_SPEED } from '../../constants'
import type { GameScene } from '../../scenes/GameScene'
import { Enemy } from './Enemy'

export class StacheSeed extends Enemy {
  readonly pointValue = 100
  inPipe = false
  private readonly reversed: boolean
  private readonly waitTime = 2500
  private movingUp = true
  private seedParentY: number
  private seedParentHeight: number

  constructor(
    scene: GameScene,
    parent: {
      x: number
      y: number
      displayWidth: number
      displayHeight: number
    } & Phaser.GameObjects.GameObject,
    reversed: boolean,
  ) {
    const width = BLOCK_SIZE
    const height = BLOCK_SIZE * 3

    let x: number
    let y: number

    if (reversed) {
      x = parent.x + parent.displayWidth / 2 - width / 2
      y = parent.y + parent.displayHeight - height
    } else {
      x = parent.x + parent.displayWidth / 2 - width / 2
      y = parent.y
    }

    const texKey = reversed ? 'stache-seed-reversed-1' : 'stache-seed-1'
    super(scene, x, y, texKey, true)

    this.reversed = reversed
    this.seedParentY = parent.y
    this.seedParentHeight = parent.displayHeight

    this.setDisplaySize(width, height)
    this.body.setSize(width, height)
    this.body.setOffset(0, 0)
    this.body.setAllowGravity(false)

    this.imageKeys = reversed
      ? ['stache-seed-reversed-1', 'stache-seed-reversed-2']
      : ['stache-seed-1', 'stache-seed-2']

    // Start movement
    this.movingUp = !reversed
    this.startMovement()
  }

  private startMovement() {
    const speed = STACHE_SEED_SPEED

    if (this.movingUp) {
      this.setVelocityY(-speed)
    } else {
      this.setVelocityY(speed)
    }
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta)
    if (this.isDead) return

    if (this.shouldChangeDirection()) {
      this.setVelocityY(0)
      this.movingUp = !this.movingUp

      // Set inPipe based on position
      if (this.reversed) {
        this.inPipe = this.movingUp // going back up into pipe
      } else {
        this.inPipe = !this.movingUp // going back down into pipe
      }

      this.scene.time.delayedCall(this.waitTime, () => {
        if (this.active) {
          this.inPipe = false
          this.startMovement()
        }
      })
    }
  }

  private shouldChangeDirection(): boolean {
    if (this.reversed) {
      if (!this.movingUp) {
        // Moving down (out of pipe)
        return this.y > this.seedParentY + this.seedParentHeight
      } else {
        // Moving up (back into pipe)
        return (
          this.y + this.displayHeight < this.seedParentY + this.seedParentHeight
        )
      }
    } else {
      if (this.movingUp) {
        // Moving up (out of pipe)
        return this.y + this.displayHeight < this.seedParentY
      } else {
        // Moving down (back into pipe)
        return this.y > this.seedParentY
      }
    }
  }
}
