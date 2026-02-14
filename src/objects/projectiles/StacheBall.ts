import Phaser from 'phaser'
import { GAME_WIDTH, STACHE_BALL_BOUNCE_Y } from '../../constants'
import type { GameScene } from '../../scenes/GameScene'

export class StacheBall extends Phaser.Physics.Arcade.Sprite {
  declare scene: GameScene
  declare body: Phaser.Physics.Arcade.Body

  constructor(scene: GameScene, x: number, y: number, velocityX: number) {
    super(scene, x, y, 'stache-ball')
    scene.add.existing(this)
    scene.physics.add.existing(this)
    scene.playerProjectiles.add(this)

    this.setOrigin(0.5, 0.5)
    this.setDisplaySize(16, 16)
    this.body.setSize(16, 16)
    this.body.setAllowGravity(true)
    this.body.setBounceY(1)

    this.setVelocityX(velocityX)
    this.setVelocityY(0)
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta)

    // Bounce when hitting ground
    if (this.body.blocked.down) {
      this.setVelocityY(STACHE_BALL_BOUNCE_Y)
    }

    // Self-destruct off-screen
    const cam = this.scene.cameras.main
    if (this.x < cam.scrollX - 100 || this.x > cam.scrollX + GAME_WIDTH + 100) {
      this.destroy()
    }
  }
}
