import {
  BLOCK_SIZE,
  STACHE_SHOT_SPEED,
  GAME_WIDTH,
  GAME_HEIGHT,
} from '../../constants'
import type { GameScene } from '../../scenes/GameScene'
import { Enemy } from './Enemy'

export const Direction = {
  UP: 1,
  DOWN: 2,
  LEFT: 3,
  RIGHT: 4,
} as const

export class StacheShot extends Enemy {
  readonly pointValue = 250

  constructor(
    scene: GameScene,
    parentX: number,
    parentY: number,
    parentWidth: number,
    parentHeight: number,
    dir: number,
  ) {
    const size = BLOCK_SIZE * 0.75
    const x = parentX + parentWidth / 2 - size / 2
    const y = parentY + parentHeight / 2 - size / 2

    let texKey: string
    if (dir === Direction.LEFT) texKey = 'stache-shot-left'
    else if (dir === Direction.RIGHT) texKey = 'stache-shot-right'
    else if (dir === Direction.UP) texKey = 'stache-shot-up'
    else texKey = 'stache-shot-down'

    super(scene, x, y, texKey, false)

    this.setDisplaySize(size, size)
    this.body.setSize(size, size)
    this.body.setOffset(0, 0)
    this.body.setAllowGravity(false)

    if (dir === Direction.LEFT) this.setVelocityX(-STACHE_SHOT_SPEED)
    else if (dir === Direction.RIGHT) this.setVelocityX(STACHE_SHOT_SPEED)
    else if (dir === Direction.UP) this.setVelocityY(-STACHE_SHOT_SPEED)
    else if (dir === Direction.DOWN) this.setVelocityY(STACHE_SHOT_SPEED)
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta)

    // Self-destruct when off-screen
    const cam = this.scene.cameras.main
    if (
      this.x < cam.scrollX - BLOCK_SIZE * 5 ||
      this.x > cam.scrollX + GAME_WIDTH + BLOCK_SIZE * 5 ||
      this.y < -BLOCK_SIZE * 5 ||
      this.y > GAME_HEIGHT + BLOCK_SIZE * 5
    ) {
      this.destroy()
    }
  }
}
