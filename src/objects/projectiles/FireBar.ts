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

    // Position the Graphics object at the anchor so rotation works correctly
    this.setPosition(anchorX, anchorY)
    this.setDepth(BELOW_PLAYER_DEPTH)

    // Draw initial bar
    this.drawBar()

    // Register with scene for manual hit detection
    scene.registerFireBar(this)
  }

  private drawBar() {
    this.clear()
    this.fillStyle(FIRE_COLOR)
    this.fillRect(
      -FIRE_BAR_WIDTH / 2,
      -FIRE_BAR_HEIGHT,
      FIRE_BAR_WIDTH,
      FIRE_BAR_HEIGHT,
    )
  }

  updateRotation(delta: number) {
    this.rotation_ += FIRE_BAR_ROTATION_SPEED * (delta / 1000)
    this.rotation_ %= Math.PI * 2
    this.rotation = this.rotation_
  }

  hitDetection(
    playerX: number,
    playerY: number,
    playerW: number,
    playerH: number,
  ): boolean {
    // Check if any corner of the player bounding box overlaps the rotated bar
    const corners = [
      { x: playerX, y: playerY }, // top-left
      { x: playerX + playerW, y: playerY }, // top-right
      { x: playerX, y: playerY + playerH }, // bottom-left
      { x: playerX + playerW, y: playerY + playerH }, // bottom-right
      { x: playerX + playerW / 2, y: playerY + playerH / 2 }, // center
    ]

    const sin = Math.sin(-this.rotation_)
    const cos = Math.cos(-this.rotation_)
    const halfW = FIRE_BAR_WIDTH / 2

    for (const corner of corners) {
      const dx = corner.x - this.anchorX
      const dy = corner.y - this.anchorY

      const localX = dx * cos - dy * sin
      const localY = dx * sin + dy * cos

      if (
        localX >= -halfW &&
        localX <= halfW &&
        localY >= -FIRE_BAR_HEIGHT &&
        localY <= 0
      ) {
        return true
      }
    }

    return false
  }
}
