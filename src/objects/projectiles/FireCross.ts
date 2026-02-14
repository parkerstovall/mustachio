import Phaser from 'phaser'
import { BLOCK_SIZE } from '../../constants'
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
  private readonly maxLength = BLOCK_SIZE * 4
  private readonly minLength = BLOCK_SIZE * 0.5
  private growSpeed = 0.75 * 50 // 37.5 px/sec
  private readonly anchorX: number
  private readonly anchorY: number
  private currentLength = BLOCK_SIZE * 0.5
  private growing = true

  constructor(scene: GameScene, parentX: number, parentY: number, dir: number) {
    const cx = parentX + BLOCK_SIZE / 2
    const cy = parentY + BLOCK_SIZE / 2

    super(scene, cx, cy, BLOCK_SIZE * 0.5, BLOCK_SIZE * 0.5, 0xff0000)
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
    const thickness = BLOCK_SIZE * 0.5

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
