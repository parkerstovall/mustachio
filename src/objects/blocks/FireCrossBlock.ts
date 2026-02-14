import Phaser from 'phaser'
import { BLOCK_SIZE } from '../../constants'
import type { GameScene } from '../../scenes/GameScene'
import { FireCross } from '../projectiles/FireCross'

export class FireCrossBlock extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: GameScene, x: number, y: number, dirs: number[]) {
    super(scene, x, y, 'obstacle-brick')
    scene.add.existing(this)
    scene.platforms.add(this)

    this.setOrigin(0, 0)
    this.setDisplaySize(BLOCK_SIZE, BLOCK_SIZE)
    this.refreshBody()

    for (const dir of dirs) {
      new FireCross(scene, x, y, dir)
    }
  }
}
