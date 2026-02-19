import Phaser from 'phaser'
import {
  FIRE_BAR_ROTATION_SPEED,
  FIRE_BAR_WIDTH,
  FIRE_BAR_HEIGHT,
  FIRE_COLOR,
  BELOW_PLAYER_DEPTH,
} from '../../constants'
import type { GameScene } from '../../scenes/GameScene'

export class FireBar extends Phaser.GameObjects.Graphics {
  declare scene: GameScene
  private rotation_ = 0
  private readonly anchorX: number
  private readonly anchorY: number

  constructor(scene: GameScene, anchorX: number, anchorY: number) {
    super(scene)
    scene.add.existing(this)

    this.anchorX = anchorX
    this.anchorY = anchorY

    this.setDepth(BELOW_PLAYER_DEPTH)

    // Register with scene for manual hit detection
    scene.registerFireBar(this)
  }

  updateRotation(delta: number) {
    this.rotation_ += FIRE_BAR_ROTATION_SPEED * (delta / 1000)
    this.rotation_ %= Math.PI * 2

    this.clear()
    this.save()
    this.translateCanvas(this.anchorX, this.anchorY)
    this.rotation = this.rotation_ // Phaser handles rotation on the graphics object

    this.fillStyle(FIRE_COLOR)
    this.fillRect(
      -FIRE_BAR_WIDTH / 2,
      -FIRE_BAR_HEIGHT,
      FIRE_BAR_WIDTH,
      FIRE_BAR_HEIGHT,
    )

    this.restore()
  }

  hitDetection(playerX: number, playerY: number): boolean {
    const dx = playerX - this.anchorX
    const dy = playerY - this.anchorY

    const sin = Math.sin(-this.rotation_)
    const cos = Math.cos(-this.rotation_)

    const localX = dx * cos - dy * sin
    const localY = dx * sin + dy * cos

    const halfW = FIRE_BAR_WIDTH / 2
    return (
      localX >= -halfW &&
      localX <= halfW &&
      localY >= -FIRE_BAR_HEIGHT &&
      localY <= 0
    )
  }
}
