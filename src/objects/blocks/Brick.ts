import Phaser from 'phaser'
import { BLOCK_SIZE } from '../../constants'
import type { GameScene } from '../../scenes/GameScene'
import { BrickDebris } from '../projectiles/BrickDebris'

export class Brick extends Phaser.Physics.Arcade.Sprite {
  declare scene: GameScene
  isBrick = true
  private punched = false

  constructor(scene: GameScene, x: number, y: number) {
    super(scene, x, y, 'brick')
    scene.add.existing(this)
    scene.breakables.add(this)

    this.setOrigin(0, 0)
    this.setDisplaySize(BLOCK_SIZE, BLOCK_SIZE)
    this.refreshBody()
  }

  punch() {
    if (this.punched) return
    this.punched = true

    this.scene.addScore(100)

    // Spawn 4 debris particles
    const speedXs = [-50, -125, 50, 125]
    const speedYs = [-100, -175, -100, -175]
    for (let i = 0; i < 4; i++) {
      new BrickDebris(
        this.scene,
        this.x + this.displayWidth / 2,
        this.y + this.displayHeight / 2,
        speedXs[i],
        speedYs[i],
      )
    }

    this.destroy()
  }
}
