import Phaser from 'phaser'
import type { GameScene } from '../../scenes/GameScene'

export class FireBar extends Phaser.GameObjects.Graphics {
  declare scene: GameScene
  private rotation_ = 0
  private readonly rotationSpeed = 0.5 // radians per second (old was 0.01/frame * 50fps)
  private readonly barWidth = 10
  private readonly barHeight = 250
  private readonly anchorX: number
  private readonly anchorY: number

  constructor(scene: GameScene, anchorX: number, anchorY: number) {
    super(scene)
    scene.add.existing(this)

    this.anchorX = anchorX
    this.anchorY = anchorY

    this.setDepth(5)

    // Register with scene for manual hit detection
    scene.registerFireBar(this)
  }

  updateRotation(delta: number) {
    this.rotation_ += this.rotationSpeed * (delta / 1000)
    this.rotation_ %= Math.PI * 2

    this.clear()
    this.save()
    this.translateCanvas(this.anchorX, this.anchorY)
    this.rotation = this.rotation_ // Phaser handles rotation on the graphics object

    this.fillStyle(0xff0000)
    this.fillRect(
      -this.barWidth / 2,
      -this.barHeight,
      this.barWidth,
      this.barHeight,
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

    const halfW = this.barWidth / 2
    return (
      localX >= -halfW &&
      localX <= halfW &&
      localY >= -this.barHeight &&
      localY <= 0
    )
  }
}
