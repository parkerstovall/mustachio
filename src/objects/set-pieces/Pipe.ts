import Phaser from 'phaser'
import { BLOCK_SIZE } from '../../constants'
import type { GameScene } from '../../scenes/GameScene'
import { StacheSeed } from '../enemies/StacheSeed'

export interface PipeOptions {
  x: number
  y: number
  width?: number
  height?: number
  hasStacheSeed?: boolean
  reversed?: boolean
}

export class Pipe extends Phaser.GameObjects.TileSprite {
  declare scene: GameScene

  constructor(scene: GameScene, options: PipeOptions) {
    const w = options.width ?? BLOCK_SIZE * 2
    const h = options.height ?? BLOCK_SIZE * 2

    super(scene, options.x, options.y, w, h, 'pipe')

    this.setOrigin(0, 0)
    scene.add.existing(this)
    scene.physics.add.existing(this, true)
    scene.platforms.add(this)

    if (options.hasStacheSeed) {
      new StacheSeed(
        scene,
        this as unknown as {
          x: number
          y: number
          displayWidth: number
          displayHeight: number
        } & Phaser.GameObjects.GameObject,
        options.reversed ?? false,
      )
    }
  }
}
