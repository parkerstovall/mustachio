import { BELOW_PLAYER_DEPTH, BLOCK_SIZE, ITEM_SPEED } from '../../constants'
import type { GameScene } from '../../scenes/GameScene'

export abstract class Item extends Phaser.Physics.Arcade.Sprite {
  declare scene: GameScene
  declare body: Phaser.Physics.Arcade.Body
  abstract readonly pointValue: number

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    size: number,
  ) {
    // Center item in block
    x += (BLOCK_SIZE - size) / 2
    y += (BLOCK_SIZE - size) / 2

    super(scene, x, y, texture)
    this.setDepth(BELOW_PLAYER_DEPTH)
    this.setOrigin(0, 0)
    this.setDisplaySize(size, size)
    scene.add.existing(this)
    scene.physics.add.existing(this)
  }

  abstract collect(): void

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta)

    if (this.body.blocked.left) {
      this.setVelocityX(ITEM_SPEED)
    } else if (this.body.blocked.right) {
      this.setVelocityX(-ITEM_SPEED)
    }
  }
}
