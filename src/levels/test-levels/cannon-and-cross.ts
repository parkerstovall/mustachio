import { BLOCK_SIZE } from '../../constants'
import type { GameScene } from '../../scenes/GameScene'
import { Direction } from '../../objects/enemies/StacheShot'
import { FallingFloor } from '../../objects/blocks/FallingFloor'
import { FireCrossBlock } from '../../objects/blocks/FireCrossBlock'
import { StacheCannon } from '../../objects/blocks/StacheCannon'
import { Floor } from '../../objects/set-pieces/Floor'

export function testLevelCannonAndCross(scene: GameScene) {
  new Floor(scene, {
    x: 0,
    y: BLOCK_SIZE * 17,
    width: BLOCK_SIZE * 13,
    height: BLOCK_SIZE,
  })

  new FallingFloor(scene, BLOCK_SIZE * 14, BLOCK_SIZE * 17)

  new Floor(scene, {
    x: BLOCK_SIZE * 15,
    y: BLOCK_SIZE * 17,
    width: BLOCK_SIZE * 17,
    height: BLOCK_SIZE,
  })

  new StacheCannon(scene, BLOCK_SIZE * 16, BLOCK_SIZE * 15, Direction.RIGHT)

  new StacheCannon(scene, BLOCK_SIZE * 16, BLOCK_SIZE * 14, Direction.UP)

  new StacheCannon(scene, BLOCK_SIZE * 15, 0, Direction.DOWN)

  new FireCrossBlock(scene, BLOCK_SIZE * 8, BLOCK_SIZE * 12, [
    Direction.UP,
    Direction.DOWN,
    Direction.LEFT,
    Direction.RIGHT,
  ])

  scene.setupCamera(BLOCK_SIZE * 32)
}
