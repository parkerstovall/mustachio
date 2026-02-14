import { BLOCK_SIZE } from '../../constants'
import type { GameScene } from '../../scenes/GameScene'
import { Floor } from '../../objects/set-pieces/Floor'
import { Flag } from '../../objects/set-pieces/Flag'

export function testLevelWinGame(scene: GameScene) {
  new Floor(scene, {
    x: 0,
    y: BLOCK_SIZE * 17,
    width: BLOCK_SIZE * 32,
    height: BLOCK_SIZE,
  })

  new Flag(scene, BLOCK_SIZE * 16, BLOCK_SIZE * 9)

  scene.setupCamera(BLOCK_SIZE * 32)
}
