import Phaser from 'phaser'
import {
  BLOCK_SIZE,
  FIRE_COLOR,
  FIRE_CROSS_GROW_SPEED,
  FIRE_CROSS_MAX_LENGTH,
  FIRE_CROSS_MIN_LENGTH,
  FIRE_CROSS_THICKNESS,
} from '../../constants'
import type { GameScene } from '../../scenes/GameScene'

const Dir = {
  UP: 1,
  DOWN: 2,
  LEFT: 3,
  RIGHT: 4,
} as const

export class FireCross extends Phaser.GameObjects.Rectangle {
  declare scene: GameScene
  private readonly dir: number
  private readonly maxLength = FIRE_CROSS_MAX_LENGTH
  private readonly minLength = FIRE_CROSS_MIN_LENGTH
  private growSpeed = FIRE_CROSS_GROW_SPEED
  private readonly anchorX: number
  private readonly anchorY: number
  private currentLength = FIRE_CROSS_MIN_LENGTH
  private growing = true

  constructor(scene: GameScene, parentX: number, parentY: number, dir: number) {
    const cx = parentX + BLOCK_SIZE / 2
    const cy = parentY + BLOCK_SIZE / 2

    super(scene, cx, cy, FIRE_CROSS_THICKNESS, FIRE_CROSS_THICKNESS, FIRE_COLOR)
    this.dir = dir
    this.anchorX = cx
    this.anchorY = cy

    scene.add.existing(this)
    scene.physics.add.existing(this, false)
    scene.enemyProjectiles.add(this)

    const body = this.body as Phaser.Physics.Arcade.Body
    body.setAllowGravity(false)
    body.setImmovable(true)

    this.setOrigin(0.5, 0.5)
  }

  preUpdate(_time: number, delta: number) {
    const dt = delta / 1000

    if (this.growing) {
      this.currentLength += this.growSpeed * dt
      if (this.currentLength >= this.maxLength) {
        this.currentLength = this.maxLength
        this.growing = false
      }
    } else {
      this.currentLength -= this.growSpeed * dt
      if (this.currentLength <= this.minLength) {
        this.currentLength = this.minLength
        this.growing = true
      }
    }

    // Update position and size based on direction
    const thickness = FIRE_CROSS_THICKNESS

    if (this.dir === Dir.LEFT) {
      this.setSize(this.currentLength, thickness)
      this.setPosition(this.anchorX - this.currentLength / 2, this.anchorY)
    } else if (this.dir === Dir.RIGHT) {
      this.setSize(this.currentLength, thickness)
      this.setPosition(this.anchorX + this.currentLength / 2, this.anchorY)
    } else if (this.dir === Dir.UP) {
      this.setSize(thickness, this.currentLength)
      this.setPosition(this.anchorX, this.anchorY - this.currentLength / 2)
    } else if (this.dir === Dir.DOWN) {
      this.setSize(thickness, this.currentLength)
      this.setPosition(this.anchorX, this.anchorY + this.currentLength / 2)
    }

    // Update physics body to match
    const body = this.body as Phaser.Physics.Arcade.Body
    body.setSize(this.width, this.height)
  }
}
