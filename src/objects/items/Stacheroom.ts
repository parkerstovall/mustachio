import { BLOCK_SIZE, ITEM_SIZE, STACHEROOM_SPEED } from '../../constants'
import type { GameScene } from '../../scenes/GameScene'
import { Item } from './Item'

export class Stacheroom extends Item {
  readonly pointValue = 1000

  constructor(scene: GameScene, x: number, y: number) {
    super(scene, x, y, 'stacheroom', ITEM_SIZE)
    this.setImmovable(false)
    this.body.setAllowGravity(false)

    this.scene.tweens.add({
      targets: this,
      y: this.y - BLOCK_SIZE / 2 - ITEM_SIZE / 2,
      duration: 500,
      onComplete: () => {
        this.scene.items.add(this)
        this.setVelocityX(STACHEROOM_SPEED)
      },
    })
  }

  collect() {
    this.scene.addScore(this.pointValue)
    this.scene.player.changeSize(true)
    this.destroy()
  }
}
