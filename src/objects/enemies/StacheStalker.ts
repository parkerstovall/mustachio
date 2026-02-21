import { ENEMY_SIZE, STALKER_SPEED } from '../../constants'
import type { GameScene } from '../../scenes/GameScene'
import { Enemy } from './Enemy'

export class StacheStalker extends Enemy {
  readonly pointValue = 100

  constructor(scene: GameScene, x: number, y: number) {
    super(scene, x, y, 'stache-stalker')

    const size = ENEMY_SIZE
    this.setDisplaySize(size, size)
    this.body.setOffset(0, 0)

    this.imageKeys = ['stache-stalker', 'stache-stalker-reversed']
    this.setVelocityX(STALKER_SPEED)
    this.body.setBounceX(1)
    this.body.setAllowGravity(true)
  }
}
