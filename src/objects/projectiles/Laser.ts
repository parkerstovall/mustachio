import Phaser from 'phaser'
import {
  GAME_HEIGHT,
  LASER_WIDTH,
  LASER_COLOR,
  LASER_STROKE_WIDTH,
  LASER_STROKE_COLOR,
} from '../../constants'
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
    const width = LASER_WIDTH
    const height = GAME_HEIGHT
    const x = parentX + parentWidth / 2
    const y = parentY + parentHeight + height / 2

    super(scene, x, y, width, height, LASER_COLOR)
    scene.add.existing(this)
    scene.physics.add.existing(this)
    const body = this.body as Phaser.Physics.Arcade.Body
    body.setAllowGravity(false)
    body.setImmovable(true)
    scene.enemyProjectiles.add(this)

    this.setStrokeStyle(LASER_STROKE_WIDTH, LASER_STROKE_COLOR)

    // Self-destruct after shotTime
    scene.time.delayedCall(shotTime, () => {
      if (this.active) this.destroy()
    })
  }
}
