import Phaser from 'phaser'
import type { GameScene } from '../../scenes/GameScene'

export class Wall extends Phaser.GameObjects.TileSprite {
  constructor(
    scene: GameScene,
    x: number,
    y: number,
    width: number,
    height: number,
  ) {
    super(scene, x, y, width, height, 'wall-tile')
    this.setOrigin(0, 0)
    scene.add.existing(this)
    scene.physics.add.existing(this, true)
    scene.platforms.add(this)
  }
}
