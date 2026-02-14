import Phaser from 'phaser'
import type { GameScene } from '../../scenes/GameScene'

export interface CaveWallOptions {
  x: number
  y: number
  width: number
  height: number
}

export class CaveWall extends Phaser.GameObjects.TileSprite {
  constructor(scene: GameScene, options: CaveWallOptions) {
    super(
      scene,
      options.x,
      options.y,
      options.width,
      options.height,
      'cave-wall',
    )

    this.setOrigin(0, 0)
    scene.add.existing(this)
    scene.physics.add.existing(this, true) // static body

    scene.platforms.add(this)
  }
}
