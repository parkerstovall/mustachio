import Phaser from 'phaser'
import { BLOCK_SIZE, GAME_HEIGHT } from '../../constants'
import type { GameScene } from '../../scenes/GameScene'

export class Laser extends Phaser.GameObjects.Rectangle {
  declare scene: GameScene

  constructor(
    scene: GameScene,
    parentX: number,
    parentY: number,
    parentWidth: number,
    parentHeight: number,
    shotTime: number,
  ) {
    const width = BLOCK_SIZE * 0.5
    const height = GAME_HEIGHT
    const x = parentX + parentWidth / 2
    const y = parentY + parentHeight + height / 2

    super(scene, x, y, width, height, 0x0000ff)
    scene.add.existing(this)
    scene.physics.add.existing(this)
    const body = this.body as Phaser.Physics.Arcade.Body
    body.setAllowGravity(false)
    body.setImmovable(true)
    scene.enemyProjectiles.add(this)

    this.setStrokeStyle(2, 0x000000)

    // Self-destruct after shotTime
    scene.time.delayedCall(shotTime, () => {
      if (this.active) this.destroy()
    })
  }
}
