import { BLOCK_SIZE } from '../constants'
import type { GameScene } from '../scenes/GameScene'
import {
  createBlockPyramid,
  createBlockSquare,
  createBlockWall,
} from './level-helpers'
import { Floor } from '../objects/set-pieces/Floor'
import { ItemBlock } from '../objects/blocks/ItemBlock'
import { Brick } from '../objects/blocks/Brick'
import { Wall } from '../objects/blocks/Wall'
import { StacheStalker } from '../objects/enemies/StacheStalker'
import { Pipe } from '../objects/set-pieces/Pipe'
import { WarpPipe } from '../objects/set-pieces/WarpPipe'
import { caveOne } from './caves/cave-one'
import { StacheCannon } from '../objects/blocks/StacheCannon'
import { Direction } from '../objects/enemies/StacheShot'
import { FireCrossBlock } from '../objects/blocks/FireCrossBlock'
import { FireBarBlock } from '../objects/blocks/FireBarBlock'
import { StacheStreaker } from '../objects/enemies/StacheStreaker'
import { Flag } from '../objects/set-pieces/Flag'

export function levelOne(scene: GameScene, previousLevels: string[] = []) {
  sectionOne(scene)
  sectionTwo(scene)
  sectionThree(scene, previousLevels)
  sectionFour(scene)
  sectionFive(scene)
  sectionSix(scene)
  sectionSeven(scene)

  if (previousLevels[0] === 'cave-one') {
    scene.setPlayerLocation(BLOCK_SIZE * 69, BLOCK_SIZE * 8)
  }

  // Set camera bounds for the full level width
  scene.setupCamera(BLOCK_SIZE * 240)
}

function sectionOne(scene: GameScene) {
  // Floor
  new Floor(scene, {
    x: 0,
    y: BLOCK_SIZE * 17,
    width: BLOCK_SIZE * 40,
    height: BLOCK_SIZE,
  })

  // First barrier
  createBlockWall(scene, 0, 0, 1, 17, 'wall')
  createBlockWall(scene, 1, 6, 1, 11, 'coin')

  new ItemBlock(scene, BLOCK_SIZE * 6, BLOCK_SIZE * 14, false, 'coin')
  new Brick(scene, BLOCK_SIZE * 7, BLOCK_SIZE * 14)
  new ItemBlock(scene, BLOCK_SIZE * 8, BLOCK_SIZE * 14, true, 'coin')
  new ItemBlock(scene, BLOCK_SIZE * 8, BLOCK_SIZE * 11, true, 'coin')
  new Brick(scene, BLOCK_SIZE * 9, BLOCK_SIZE * 14)
  new ItemBlock(scene, BLOCK_SIZE * 10, BLOCK_SIZE * 14, false, 'coin')

  createBlockPyramid(scene, 16, 16, 12, 'wall')

  new Wall(scene, BLOCK_SIZE * 39, BLOCK_SIZE * 16, BLOCK_SIZE, BLOCK_SIZE)

  new StacheStalker(scene, BLOCK_SIZE * 28, BLOCK_SIZE * 14)
  new StacheStalker(scene, BLOCK_SIZE * 34, BLOCK_SIZE * 14)
}

function sectionTwo(scene: GameScene) {
  new Wall(scene, BLOCK_SIZE * 46, BLOCK_SIZE * 16, BLOCK_SIZE, BLOCK_SIZE)
  new ItemBlock(scene, BLOCK_SIZE * 49, BLOCK_SIZE * 13, false, 'coin')
  new ItemBlock(scene, BLOCK_SIZE * 49, BLOCK_SIZE * 9, true, 'stacheroom')

  createBlockSquare(scene, 53, 11, 6, 4, 'brick')
  createBlockWall(scene, 54, 12, 4, 2, 'coin')

  new Pipe(scene, {
    x: BLOCK_SIZE * 64,
    y: BLOCK_SIZE * 15,
    hasStacheSeed: true,
  })

  // Floor
  new Floor(scene, {
    x: BLOCK_SIZE * 46,
    y: BLOCK_SIZE * 17,
    width: BLOCK_SIZE * 20,
    height: BLOCK_SIZE,
  })
}

function sectionThree(scene: GameScene, previousLevels: string[]) {
  createBlockWall(scene, 66, 17, 23, 1, 'wall')

  if (previousLevels.includes('cave-one')) {
    new Pipe(scene, {
      x: BLOCK_SIZE * 73,
      y: BLOCK_SIZE * 9,
    })
  } else {
    new WarpPipe(scene, {
      x: BLOCK_SIZE * 73,
      y: BLOCK_SIZE * 9,
      setNewLevel: caveOne,
    })
  }

  createBlockWall(scene, 73, 11, 2, 1, 'wall')

  createBlockWall(scene, 78, 16, 1, 1, 'wall')
  new StacheCannon(scene, BLOCK_SIZE * 78, BLOCK_SIZE * 15, Direction.LEFT)

  createBlockWall(scene, 80, 15, 1, 2, 'wall')
  new StacheCannon(scene, BLOCK_SIZE * 80, BLOCK_SIZE * 14, Direction.LEFT)

  createBlockWall(scene, 82, 14, 1, 3, 'wall')
  new StacheCannon(scene, BLOCK_SIZE * 82, BLOCK_SIZE * 13, Direction.LEFT)

  createBlockWall(scene, 84, 13, 1, 4, 'wall')
  new StacheCannon(scene, BLOCK_SIZE * 84, BLOCK_SIZE * 12, Direction.LEFT)
}

function sectionFour(scene: GameScene) {
  createBlockWall(scene, 89, 17, 33, 1, 'falling-floor')

  for (let i = 0; i < 11; i++) {
    new Pipe(scene, {
      x: BLOCK_SIZE * (89 + i * 3),
      y: 0,
      height: BLOCK_SIZE * 14,
      hasStacheSeed: true,
      reversed: true,
    })
  }

  createBlockWall(scene, 122, 17, 5, 1, 'wall')
}

function sectionFive(scene: GameScene) {
  createBlockWall(scene, 126, 14, 1, 3, 'wall')

  new ItemBlock(scene, BLOCK_SIZE * 121, BLOCK_SIZE * 13, false, 'stacheroom')

  new FireCrossBlock(scene, BLOCK_SIZE * 126, BLOCK_SIZE * 13, [
    Direction.LEFT,
    Direction.RIGHT,
  ])

  new FireBarBlock(scene, BLOCK_SIZE * 126, BLOCK_SIZE * 7)

  createBlockWall(scene, 129, 13, 1, 4, 'coin')
  createBlockWall(scene, 129, 17, 1, 1, 'wall')
  createBlockWall(scene, 133, 17, 15, 1, 'wall')
  createBlockWall(scene, 132, 0, 1, 14, 'wall')
  createBlockWall(scene, 137, 5, 1, 12, 'wall')

  new FireCrossBlock(scene, BLOCK_SIZE * 132, BLOCK_SIZE * 17, [Direction.UP])

  new FireCrossBlock(scene, BLOCK_SIZE * 136, BLOCK_SIZE * 14, [Direction.LEFT])

  new FireCrossBlock(scene, BLOCK_SIZE * 133, BLOCK_SIZE * 11, [
    Direction.RIGHT,
  ])

  new FireCrossBlock(scene, BLOCK_SIZE * 136, BLOCK_SIZE * 8, [Direction.LEFT])

  new FireCrossBlock(scene, BLOCK_SIZE * 133, BLOCK_SIZE * 5, [Direction.RIGHT])

  createBlockWall(scene, 138, 5, 4, 1, 'falling-floor')
  createBlockWall(scene, 138, 8, 4, 1, 'falling-floor')
  createBlockWall(scene, 138, 11, 4, 1, 'falling-floor')
  createBlockWall(scene, 138, 14, 4, 1, 'falling-floor')

  createBlockWall(scene, 142, 0, 1, 15, 'wall')

  new StacheStalker(scene, BLOCK_SIZE * 140, BLOCK_SIZE * 6)
  new StacheStalker(scene, BLOCK_SIZE * 140, BLOCK_SIZE * 9)
  new StacheStalker(scene, BLOCK_SIZE * 140, BLOCK_SIZE * 12)
}

function sectionSix(scene: GameScene) {
  for (let i = 0; i < 5; i++) {
    new StacheCannon(
      scene,
      BLOCK_SIZE * 143,
      BLOCK_SIZE * (i * 3 + 2),
      Direction.RIGHT,
    )
  }

  createBlockWall(scene, 150, 3, 1, 1, 'wall')
  createBlockWall(scene, 150, 6, 1, 1, 'wall')
  createBlockWall(scene, 150, 9, 1, 1, 'wall')
  createBlockWall(scene, 150, 12, 1, 1, 'wall')
  createBlockWall(scene, 150, 15, 1, 1, 'wall')

  createBlockWall(scene, 153, 4, 1, 1, 'wall')
  createBlockWall(scene, 153, 7, 1, 1, 'wall')
  createBlockWall(scene, 153, 10, 1, 1, 'wall')
  createBlockWall(scene, 153, 13, 1, 1, 'wall')
  createBlockWall(scene, 153, 16, 1, 1, 'wall')

  createBlockWall(scene, 156, 2, 1, 1, 'wall')
  createBlockWall(scene, 156, 5, 1, 1, 'wall')
  createBlockWall(scene, 156, 8, 1, 1, 'wall')
  createBlockWall(scene, 156, 11, 1, 1, 'wall')
  createBlockWall(scene, 156, 14, 1, 1, 'wall')

  createBlockWall(scene, 159, 3, 1, 1, 'wall')
  createBlockWall(scene, 159, 6, 1, 1, 'wall')
  createBlockWall(scene, 159, 9, 1, 1, 'wall')
  createBlockWall(scene, 159, 12, 1, 1, 'wall')
  createBlockWall(scene, 159, 15, 1, 1, 'wall')

  new StacheStreaker(scene, BLOCK_SIZE * 155, 0)
  const enemy = new StacheStreaker(scene, BLOCK_SIZE * 152, 0)
  enemy.setVelocityX(-enemy.body.velocity.x)

  new Pipe(scene, {
    x: BLOCK_SIZE * 162,
    y: 0,
    height: BLOCK_SIZE * 4,
    hasStacheSeed: true,
    reversed: true,
  })

  new Pipe(scene, {
    x: BLOCK_SIZE * 162,
    y: BLOCK_SIZE * 10,
    height: BLOCK_SIZE * 8,
    hasStacheSeed: true,
  })
}

function sectionSeven(scene: GameScene) {
  createBlockWall(scene, 168, 7, 2, 1, 'falling-floor')
  createBlockWall(scene, 172, 4, 2, 1, 'falling-floor')
  createBlockWall(scene, 184, 15, 2, 1, 'falling-floor')
  createBlockWall(scene, 189, 12, 1, 1, 'falling-floor')
  createBlockWall(scene, 193, 9, 1, 1, 'falling-floor')
  createBlockWall(scene, 189, 6, 1, 1, 'falling-floor')
  createBlockWall(scene, 193, 3, 1, 1, 'falling-floor')
  createBlockWall(scene, 194, 2, 1, 15, 'falling-floor')

  createBlockSquare(scene, 198, 7, 10, 6, 'falling-floor')
  createBlockWall(scene, 199, 8, 8, 4, 'coin')

  createBlockWall(scene, 208, 17, 32, 1, 'wall')
  new Flag(scene, BLOCK_SIZE * 220, BLOCK_SIZE * 9)
}
