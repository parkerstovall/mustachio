import Phaser from 'phaser'
import { BLOCK_SIZE, GAME_WIDTH } from '../../constants'
import type { GameScene } from '../../scenes/GameScene'
import { StacheShot, Direction } from '../enemies/StacheShot'

export class StacheCannon extends Phaser.Physics.Arcade.Sprite {
  declare scene: GameScene
  private readonly dir: number
  private shotTimer: Phaser.Time.TimerEvent

  constructor(scene: GameScene, x: number, y: number, dir: number) {
    let texKey: string
    if (dir === Direction.UP) texKey = 'cannon-up'
    else if (dir === Direction.DOWN) texKey = 'cannon-down'
    else if (dir === Direction.LEFT) texKey = 'cannon-left'
    else texKey = 'cannon-right'

    super(scene, x, y, texKey)
    this.dir = dir

    scene.add.existing(this)
    scene.platforms.add(this)

    this.setOrigin(0, 0)
    this.setDisplaySize(BLOCK_SIZE, BLOCK_SIZE)
    this.refreshBody()

    this.shotTimer = scene.time.addEvent({
      delay: 6000,
      loop: true,
      callback: () => {
        // Only fire if on screen
        const cam = scene.cameras.main
        if (
          this.x > cam.scrollX - BLOCK_SIZE * 2 &&
          this.x < cam.scrollX + GAME_WIDTH + BLOCK_SIZE * 2
        ) {
          new StacheShot(
            scene,
            this.x,
            this.y,
            this.displayWidth,
            this.displayHeight,
            this.dir,
          )
        }
      },
    })
  }

  destroy(fromScene?: boolean) {
    if (this.shotTimer) {
      this.shotTimer.remove()
    }
    super.destroy(fromScene)
  }
}
