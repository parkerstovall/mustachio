import Phaser from 'phaser'
import { BLOCK_SIZE } from '../../constants'
import type { GameScene } from '../../scenes/GameScene'
import { FireBar } from '../projectiles/FireBar'

export class FireBarBlock extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: GameScene, x: number, y: number) {
    super(scene, x, y, 'obstacle-brick')
    scene.add.existing(this)
    scene.platforms.add(this)

    this.setOrigin(0, 0)
    this.setDisplaySize(BLOCK_SIZE, BLOCK_SIZE)
    this.refreshBody()

    // Create fire bar anchored at center of block
    new FireBar(scene, x + BLOCK_SIZE / 2, y + BLOCK_SIZE / 2)
  }
}
