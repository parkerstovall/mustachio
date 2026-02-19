import Phaser from 'phaser'
import {
  BLOCK_SIZE,
  STACHE_SEED_SPEED,
  STACHE_SEED_WAIT_TIME,
  STACHE_SEED_HEIGHT,
  ITEM_DEPTH,
} from '../../constants'
import type { GameScene } from '../../scenes/GameScene'
import { Enemy } from './Enemy'

export class StacheSeed extends Enemy {
  inPipe = false
  readonly pointValue = 350

  constructor(
    scene: GameScene,
    parent: {
      x: number
      y: number
      displayWidth: number
      displayHeight: number
    } & Phaser.GameObjects.GameObject,
    reversed: boolean,
  ) {
    const width = BLOCK_SIZE
    const height = STACHE_SEED_HEIGHT

    let x: number
    let y: number

    if (reversed) {
      x = parent.x + parent.displayWidth / 2 - width / 2
      y = parent.y + parent.displayHeight - height
    } else {
      x = parent.x + parent.displayWidth / 2 - width / 2
      y = parent.y
    }

    const texKey = reversed ? 'stache-seed-reversed-1' : 'stache-seed-1'
    super(scene, x, y, texKey, true)

    this.setDepth(ITEM_DEPTH)
    this.scene.enemies.remove(this) // Remove from enemies group so it doesn't interact with other enemies
    this.scene.stacheSeeds.add(this) // Add to stacheSeeds group for player collision

    this.setDisplaySize(width, height)
    this.body.setOffset(0, 0)
    this.body.setAllowGravity(false)

    this.imageKeys = reversed
      ? ['stache-seed-reversed-1', 'stache-seed-reversed-2']
      : ['stache-seed-1', 'stache-seed-2']

    // Calculate movement parameters
    const distance = height
    const duration = (distance / STACHE_SEED_SPEED) * 1000

    // Determine start and end positions based on orientation
    const endY = reversed ? parent.y + parent.displayHeight : parent.y - height

    // Create looping tween
    scene.tweens.add({
      targets: this,
      y: endY,
      duration: duration,
      ease: 'Linear',
      yoyo: true,
      repeat: -1,
      hold: STACHE_SEED_WAIT_TIME,
      repeatDelay: STACHE_SEED_WAIT_TIME,
      onStart: () => {
        this.inPipe = false
      },
      onYoyo: () => {
        this.inPipe = true
      },
      onRepeat: () => {
        this.inPipe = false
      },
    })
  }
}
