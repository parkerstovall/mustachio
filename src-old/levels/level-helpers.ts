import { BLOCK_SIZE } from '../shared/constants'
import { Wall } from '../classes/game-objects/set-pieces/obstacles/blocks/wall'
import type { GameContext } from '../shared/game-context'
import { Coin } from '../classes/game-objects/point-objects/items/coin'
import { Brick } from '../classes/game-objects/set-pieces/obstacles/blocks/punchable-blockS/brick'
import { FallingFloor } from '../classes/game-objects/set-pieces/obstacles/blocks/falling-floor'

export type BlockType = 'wall' | 'brick' | 'coin' | 'falling-floor'

export function createBlockWall(
  gameContext: GameContext,
  startingX: number,
  startingY: number,
  numBlocksWide: number,
  numBlocksHigh: number,
  blockType: BlockType,
) {
  for (let i = 0; i < numBlocksWide; i++) {
    for (let j = 0; j < numBlocksHigh; j++) {
      const x = (startingX + i) * BLOCK_SIZE
      const y = (startingY + j) * BLOCK_SIZE
      if (blockType === 'wall') {
        gameContext.addGameObject(new Wall(gameContext, x, y))
      } else if (blockType === 'brick') {
        gameContext.addGameObject(new Brick(gameContext, x, y))
      } else if (blockType === 'coin') {
        gameContext.addGameObject(new Coin(gameContext, x, y))
      } else if (blockType === 'falling-floor') {
        gameContext.addGameObject(new FallingFloor(gameContext, x, y))
      }
    }
  }
}

export function createBlockPyramid(
  gameContext: GameContext,
  startingX: number,
  startingY: number,
  numBlocksWide: number,
  blockType: BlockType,
) {
  while (numBlocksWide > 0) {
    createBlockWall(
      gameContext,
      startingX,
      startingY,
      numBlocksWide,
      1,
      blockType,
    )

    startingX += 1
    startingY -= 1
    numBlocksWide -= 2
  }
}

export function createBlockSquare(
  gameContext: GameContext,
  startingX: number,
  startingY: number,
  numBlocksWide: number,
  numBlocksHigh: number,
  blockType: BlockType,
) {
  createBlockWall(
    gameContext,
    startingX,
    startingY,
    numBlocksWide,
    1,
    blockType,
  )

  createBlockWall(
    gameContext,
    startingX,
    startingY + numBlocksHigh - 1,
    numBlocksWide,
    1,
    blockType,
  )

  createBlockWall(
    gameContext,
    startingX,
    startingY + 1,
    1,
    numBlocksHigh - 2,
    blockType,
  )

  createBlockWall(
    gameContext,
    startingX + numBlocksWide - 1,
    startingY + 1,
    1,
    numBlocksHigh - 2,
    blockType,
  )
}
