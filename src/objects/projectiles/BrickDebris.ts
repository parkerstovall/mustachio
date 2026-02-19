import Phaser from 'phaser'
import { GAME_HEIGHT, PROJECTILE_SIZE } from '../../constants'
import type { GameScene } from '../../scenes/GameScene'

export class BrickDebris extends Phaser.Physics.Arcade.Sprite {
  declare scene: GameScene
  declare body: Phaser.Physics.Arcade.Body

  constructor(
    scene: GameScene,
    x: number,
    y: number,
    velocityX: number,
    velocityY: number,
  ) {
    super(scene, x, y, 'brick-debris')
    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.setOrigin(0.5, 0.5)
    this.setDisplaySize(PROJECTILE_SIZE, PROJECTILE_SIZE)
    this.body.setAllowGravity(true)

    this.setVelocity(velocityX, velocityY)
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta)

    if (this.y > GAME_HEIGHT) {
      this.destroy()
    }
  }
}
