import Phaser from 'phaser'
import { BLOCK_SIZE } from '../../constants'
import type { GameScene } from '../../scenes/GameScene'

export class Coin extends Phaser.Physics.Arcade.Sprite {
  declare scene: GameScene
  readonly pointValue = 100

  constructor(scene: GameScene, x: number, y: number, fromItemBlock = false) {
    super(scene, x, y, 'coin')

    scene.add.existing(this)

    if (fromItemBlock) {
      // From item block: animate up then auto-collect
      scene.physics.add.existing(this)
      ;(this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false)
      this.setOrigin(0.5, 0.5)
      this.setDisplaySize(23, 23)

      // Tween up then collect
      scene.tweens.add({
        targets: this,
        y: y - BLOCK_SIZE,
        duration: 400,
        ease: 'Quad.easeOut',
        onComplete: () => {
          this.collect()
        },
      })
    } else {
      // Static collectible on ground
      scene.physics.add.existing(this)
      scene.items.add(this)
      const body = this.body as Phaser.Physics.Arcade.Body
      body.setAllowGravity(false)
      body.setImmovable(true)
      this.setOrigin(0, 0)
      // Center in block
      this.x = x + BLOCK_SIZE / 2 - 11.5
      this.y = y + BLOCK_SIZE / 2 - 11.5
      this.setDisplaySize(23, 23)
      this.refreshBody()
    }
  }

  collect() {
    this.scene.addScore(this.pointValue)
    this.destroy()
  }
}
