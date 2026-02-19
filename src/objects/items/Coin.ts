import { BLOCK_SIZE, COIN_SIZE, COIN_RISE_DURATION } from '../../constants'
import type { GameScene } from '../../scenes/GameScene'
import { Item } from './Item'

export class Coin extends Item {
  readonly pointValue = 100

  constructor(scene: GameScene, x: number, y: number, fromItemBlock = false) {
    super(scene, x, y, 'coin', COIN_SIZE)

    if (fromItemBlock) {
      this.body.setAllowGravity(false)

      // Tween up then collect
      scene.tweens.add({
        targets: this,
        y: y - BLOCK_SIZE,
        duration: COIN_RISE_DURATION,
        ease: 'Quad.easeOut',
        onComplete: () => {
          this.collect()
        },
      })
    } else {
      // Static collectible on ground
      scene.physics.add.existing(this)
      scene.items.add(this)
      this.body.setAllowGravity(false)
      this.body.setImmovable(true)
      this.setOrigin(0, 0)
      this.refreshBody()
    }
  }

  collect() {
    this.scene.addScore(this.pointValue)
    this.destroy()
  }
}
