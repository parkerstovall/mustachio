import Phaser from 'phaser'
import type { GameScene } from '../../scenes/GameScene'

export interface FloorOptions {
  x: number
  y: number
  width: number
  height: number
}

export class Floor extends Phaser.GameObjects.TileSprite {
  constructor(scene: GameScene, options: FloorOptions) {
    super(
      scene,
      options.x,
      options.y,
      options.width,
      options.height,
      'floor-tile',
    )

    this.setOrigin(0, 0)
    scene.add.existing(this)
    scene.physics.add.existing(this, true) // static body

    // Add to platforms group
    scene.platforms.add(this)
  }
}
