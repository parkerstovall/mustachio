import { BLOCK_SIZE } from '../../constants'
import type { GameScene } from '../../scenes/GameScene'
import { StacheSlinger } from '../../objects/enemies/StacheSlinger'
import { StacheStreaker } from '../../objects/enemies/StacheStreaker'
import { Floor } from '../../objects/set-pieces/Floor'
import { Pipe } from '../../objects/set-pieces/Pipe'
import { WarpPipe } from '../../objects/set-pieces/WarpPipe'
import { caveOne } from '../caves/cave-one'

export function testLevelCaveAndEnemies(
  scene: GameScene,
  previousLevels: string[] = [],
) {
  if (previousLevels.includes('caveOne')) {
    scene.setPlayerLocation(BLOCK_SIZE * 18.5, BLOCK_SIZE * 2.5)
  }

  new Floor(scene, {
    x: 0,
    y: BLOCK_SIZE * 17,
    width: BLOCK_SIZE * 32,
    height: BLOCK_SIZE,
  })

  const touchingFloor = BLOCK_SIZE * 16

  if (previousLevels.includes('caveOne')) {
    new Pipe(scene, {
      x: BLOCK_SIZE * 10,
      y: touchingFloor,
      hasStacheSeed: true,
    })
  } else {
    new WarpPipe(scene, {
      x: BLOCK_SIZE * 10,
      y: touchingFloor,
      hasStacheSeed: true,
      setNewLevel: (gc, prev) => caveOne(gc, [...(prev ?? []), 'testLevelTwo']),
    })
  }

  new Pipe(scene, {
    x: BLOCK_SIZE * 12,
    y: touchingFloor,
    hasStacheSeed: true,
  })

  new Pipe(scene, { x: BLOCK_SIZE * 18, y: 0 })

  new StacheSlinger(scene, BLOCK_SIZE * 5, BLOCK_SIZE * 2)
  new StacheStreaker(scene, BLOCK_SIZE * 10, BLOCK_SIZE * 2)

  scene.setupCamera(BLOCK_SIZE * 32)
}
