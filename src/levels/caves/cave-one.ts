import { BLOCK_SIZE, GAME_HEIGHT } from '../../constants'
import type { GameScene } from '../../scenes/GameScene'
import { CaveWall } from '../../objects/blocks/CaveWall'
import { Coin } from '../../objects/items/Coin'
import { Pipe } from '../../objects/set-pieces/Pipe'
import { WarpPipe } from '../../objects/set-pieces/WarpPipe'
import { ItemBlock } from '../../objects/blocks/ItemBlock'
import { levelOne } from '../level-one'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function caveOne(scene: GameScene, _previousLevels: string[] = []) {
  scene.setStatic(true)

  // Cave walls
  new CaveWall(scene, {
    x: 0,
    y: 0,
    width: BLOCK_SIZE * 4,
    height: GAME_HEIGHT,
  })

  new CaveWall(scene, {
    x: BLOCK_SIZE * 28,
    y: 0,
    width: BLOCK_SIZE * 4,
    height: GAME_HEIGHT,
  })

  new CaveWall(scene, {
    x: BLOCK_SIZE * 4,
    y: BLOCK_SIZE * 16,
    width: BLOCK_SIZE * 24,
    height: BLOCK_SIZE * 2,
  })

  new CaveWall(scene, {
    x: BLOCK_SIZE * 4,
    y: 0,
    width: BLOCK_SIZE * 24,
    height: BLOCK_SIZE * 2,
  })

  new Pipe(scene, {
    x: BLOCK_SIZE * 4,
    y: BLOCK_SIZE * 2,
  })

  new WarpPipe(scene, {
    x: BLOCK_SIZE * 26,
    y: BLOCK_SIZE * 14,
    setNewLevel: (gc, prev) => levelOne(gc, [...(prev ?? []), 'cave-one']),
  })

  for (let i = 7; i < 24; i += 2) {
    for (let j = 10; j < 16; j += 2) {
      new Coin(scene, BLOCK_SIZE * i, BLOCK_SIZE * j)
    }
  }

  new ItemBlock(scene, BLOCK_SIZE * 27, BLOCK_SIZE * 9, true, 'fire-stache')

  scene.setPlayerLocation(BLOCK_SIZE * 4.5, BLOCK_SIZE * 5)
}
