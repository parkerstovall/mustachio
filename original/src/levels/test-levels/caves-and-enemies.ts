import { BLOCK_SIZE } from '../../shared/constants'
import type { GameContext } from '../../shared/game-context'
import { StacheSlinger } from '../../classes/game-objects/point-objects/enemies/stache-slinger'
import { StacheStreaker } from '../../classes/game-objects/point-objects/enemies/stache-streaker'
import { Floor } from '../../classes/game-objects/set-pieces/obstacles/floor'
import { Pipe } from '../../classes/game-objects/set-pieces/obstacles/pipe'
import { WarpPipe } from '../../classes/game-objects/set-pieces/obstacles/warp-pipe'
import { caveOne } from '../caves/cave-one'

export function testLevelCaveAndEnemies(
  gameContext: GameContext,
  previousLevels: string[] = [],
) {
  gameContext.clearLevel()

  if (previousLevels.includes('caveOne')) {
    gameContext.setPlayerLocation(BLOCK_SIZE * 18.5, BLOCK_SIZE * 2.5)
  }

  gameContext.addGameObject(
    new Floor(gameContext, {
      x: 0,
      y: BLOCK_SIZE * 17,
      width: BLOCK_SIZE * 32,
      height: BLOCK_SIZE,
    }),
  )

  // The game canvas is 32 blocks wide
  // and 18 blocks tall

  const touchingFloor = BLOCK_SIZE * 16

  let pipe: Pipe
  if (previousLevels.includes('caveOne')) {
    pipe = new Pipe(gameContext, {
      x: BLOCK_SIZE * 10,
      y: touchingFloor,
      hasStacheSeed: true,
    })
  } else {
    pipe = new WarpPipe(gameContext, {
      x: BLOCK_SIZE * 10,
      y: touchingFloor,
      hasStacheSeed: true,
      setNewLevel: (gc) => caveOne(gc, [...previousLevels, 'testLevelTwo']),
    })
  }

  gameContext.addGameObject(pipe)

  gameContext.addGameObject(
    (pipe = new Pipe(gameContext, {
      x: BLOCK_SIZE * 12,
      y: touchingFloor,
      hasStacheSeed: true,
    })),
  )

  gameContext.addGameObject(new Pipe(gameContext, { x: BLOCK_SIZE * 18, y: 0 }))

  gameContext.addGameObject(
    new StacheSlinger(gameContext, BLOCK_SIZE * 5, BLOCK_SIZE * 2),
  )

  gameContext.addGameObject(
    new StacheStreaker(gameContext, BLOCK_SIZE * 10, BLOCK_SIZE * 2),
  )

  gameContext.startMainLoop()
}
