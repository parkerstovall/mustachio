import Phaser from 'phaser'
import {
  GAME_WIDTH,
  BLOCK_SIZE,
  CLOUD_SPEED_MIN,
  CLOUD_SPEED_RANGE,
  CLOUD_Y_RANGE_MULTIPLIER,
  CLOUD_COLOR,
  CLOUD_ALPHA,
  SKY_COLOR,
} from '../constants'

export class BackgroundScene extends Phaser.Scene {
  private clouds: { graphic: Phaser.GameObjects.Graphics; speed: number }[] = []

  constructor() {
    super({ key: 'BackgroundScene' })
  }

  create() {
    // Sky background
    this.cameras.main.setBackgroundColor(SKY_COLOR)

    // Create clouds
    const cloudPositions = [
      { x: BLOCK_SIZE * 2, y: BLOCK_SIZE * 2 },
      { x: BLOCK_SIZE * 8, y: BLOCK_SIZE * 3 },
      { x: BLOCK_SIZE * 15, y: BLOCK_SIZE * 1 },
      { x: BLOCK_SIZE * 23, y: BLOCK_SIZE * 4 },
      { x: BLOCK_SIZE * 27, y: BLOCK_SIZE * 2 },
    ]

    for (const pos of cloudPositions) {
      const g = this.add.graphics()
      g.fillStyle(CLOUD_COLOR, CLOUD_ALPHA)
      g.fillEllipse(0, 0, BLOCK_SIZE * 2, BLOCK_SIZE)
      g.fillEllipse(
        BLOCK_SIZE * 0.8,
        -BLOCK_SIZE * 0.3,
        BLOCK_SIZE * 1.5,
        BLOCK_SIZE * 0.8,
      )
      g.fillEllipse(
        -BLOCK_SIZE * 0.6,
        -BLOCK_SIZE * 0.1,
        BLOCK_SIZE * 1.2,
        BLOCK_SIZE * 0.7,
      )
      g.setPosition(pos.x, pos.y)
      this.clouds.push({
        graphic: g,
        speed: CLOUD_SPEED_MIN + Math.random() * CLOUD_SPEED_RANGE,
      })
    }
  }

  update(_time: number, delta: number) {
    for (const cloud of this.clouds) {
      cloud.graphic.x += cloud.speed * (delta / 1000)
      if (cloud.graphic.x > GAME_WIDTH + BLOCK_SIZE * 2) {
        cloud.graphic.x = -BLOCK_SIZE * 3
        cloud.graphic.y =
          BLOCK_SIZE + Math.random() * BLOCK_SIZE * CLOUD_Y_RANGE_MULTIPLIER
      }
    }
  }
}
