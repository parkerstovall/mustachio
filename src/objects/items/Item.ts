import { BLOCK_SIZE } from '../../constants'
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
    this.setDepth(-1)
    this.setOrigin(0, 0)
    this.setDisplaySize(size, size)
    scene.add.existing(this)
    scene.physics.add.existing(this)
  }

  abstract collect(): void
}
