import Phaser from 'phaser'
import type { GameScene } from '../../scenes/GameScene'

export abstract class Enemy extends Phaser.Physics.Arcade.Sprite {
  declare scene: GameScene
  declare body: Phaser.Physics.Arcade.Body

  isDead = false
  abstract readonly pointValue: number

  protected imageKeys: string[] = []
  protected imageIndex = 0
  private animTimer: Phaser.Time.TimerEvent | null = null

  constructor(
    scene: GameScene,
    x: number,
    y: number,
    texture: string,
    animate = true,
  ) {
    super(scene, x, y, texture)
    scene.add.existing(this)
    scene.physics.add.existing(this)
    scene.enemies.add(this)
    this.setOrigin(0, 0)

    if (animate) {
      this.animTimer = scene.time.addEvent({
        delay: 250,
        loop: true,
        callback: () => this.nextImage(),
      })
    }
  }

  protected nextImage() {
    if (this.imageKeys.length === 0) return
    this.imageIndex = (this.imageIndex + 1) % this.imageKeys.length
    const w = this.displayWidth
    const h = this.displayHeight
    this.setTexture(this.imageKeys[this.imageIndex])
    this.setDisplaySize(w, h)
  }

  enemyHit() {
    if (this.isDead) return
    this.isDead = true

    this.setVelocity(0, 0)
    this.body.setAllowGravity(false)

    // Squish animation
    const oldHeight = this.displayHeight
    this.setDisplaySize(this.displayWidth, oldHeight / 2)
    this.y += oldHeight / 2
    this.body.setSize(this.body.width, this.body.height / 2)

    this.scene.addScore(this.pointValue)

    this.scene.time.delayedCall(500, () => {
      this.destroy()
    })
  }

  destroy(fromScene?: boolean) {
    if (this.animTimer) {
      this.animTimer.remove()
      this.animTimer = null
    }
    super.destroy(fromScene)
  }
}
