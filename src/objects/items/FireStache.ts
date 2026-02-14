import Phaser from 'phaser'
import { STACHEROOM_SPEED } from '../../constants'
import type { GameScene } from '../../scenes/GameScene'

export class FireStache extends Phaser.Physics.Arcade.Sprite {
  declare scene: GameScene
  declare body: Phaser.Physics.Arcade.Body
  readonly pointValue = 1000

  constructor(scene: GameScene, x: number, y: number, fromItemBlock = false) {
    super(scene, x, y, 'fire-stache')

    scene.add.existing(this)
    scene.physics.add.existing(this)
    scene.items.add(this)

    this.setOrigin(0, 0)
    this.setDisplaySize(30, 30)
    this.body.setSize(30, 30)
    this.body.setOffset(0, 0)

    if (fromItemBlock) {
      this.body.setAllowGravity(false)
      this.setVelocityY(-25)

      scene.time.delayedCall(800, () => {
        this.body.setAllowGravity(true)
        this.setVelocityX(STACHEROOM_SPEED)
        this.body.setBounceX(1)
      })
    } else {
      this.setVelocityX(STACHEROOM_SPEED)
      this.body.setBounceX(1)
    }
  }

  collect() {
    this.scene.addScore(this.pointValue)
    this.scene.player.changeFire(true)
    this.destroy()
  }
}
