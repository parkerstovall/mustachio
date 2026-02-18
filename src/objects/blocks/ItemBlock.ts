import Phaser from 'phaser'
import { BLOCK_SIZE } from '../../constants'
import type { GameScene } from '../../scenes/GameScene'
import { Coin } from '../items/Coin'
import { Stacheroom } from '../items/Stacheroom'
import { FireStache } from '../items/FireStache'

export type ItemType = 'coin' | 'stacheroom' | 'fire-stache'

export class ItemBlock extends Phaser.Physics.Arcade.Sprite {
  declare scene: GameScene
  declare body: Phaser.Physics.Arcade.StaticBody
  hidden: boolean
  private punched = false
  private readonly itemType: ItemType

  constructor(
    scene: GameScene,
    x: number,
    y: number,
    hidden: boolean,
    itemType: ItemType,
  ) {
    super(scene, x, y, hidden ? '__DEFAULT' : 'item-block')
    this.hidden = hidden
    this.itemType = itemType

    scene.add.existing(this)
    scene.breakables.add(this)

    this.setOrigin(0, 0)
    this.setDisplaySize(BLOCK_SIZE, BLOCK_SIZE)
    this.refreshBody()

    if (hidden) {
      this.setVisible(false)
      this.body.enable = false
      scene.registerHiddenBlock(this)
    }
  }

  punch() {
    if (this.punched) return
    this.punched = true
    this.hidden = false
    this.setVisible(true)
    this.body.enable = true
    this.setTexture('punched-block')
    this.setDisplaySize(BLOCK_SIZE, BLOCK_SIZE)
    this.refreshBody()

    switch (this.itemType) {
      case 'coin':
        new Coin(this.scene, this.x, this.y, true)
        break
      case 'stacheroom':
        new Stacheroom(this.scene, this.x, this.y)
        break
      case 'fire-stache':
        new FireStache(this.scene, this.x, this.y)
        break
    }
  }
}
