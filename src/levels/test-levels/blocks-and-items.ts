import { BLOCK_SIZE } from '../../constants'
import type { GameScene } from '../../scenes/GameScene'
import { StacheStalker } from '../../objects/enemies/StacheStalker'
import { Coin } from '../../objects/items/Coin'
import { FireBarBlock } from '../../objects/blocks/FireBarBlock'
import { ItemBlock } from '../../objects/blocks/ItemBlock'
import { Wall } from '../../objects/blocks/Wall'
import { Floor } from '../../objects/set-pieces/Floor'
import { Brick } from '../../objects/blocks/Brick'

export function testLevelBlocksAndItems(scene: GameScene) {
  new Floor(scene, {
    x: 0,
    y: BLOCK_SIZE * 17,
    width: BLOCK_SIZE * 32,
    height: BLOCK_SIZE,
  })

  const touchingFloor = BLOCK_SIZE * 16

  new Wall(scene, BLOCK_SIZE * 14, touchingFloor, BLOCK_SIZE, BLOCK_SIZE)
  new Wall(scene, BLOCK_SIZE * 22, touchingFloor, BLOCK_SIZE, BLOCK_SIZE)

  new StacheStalker(scene, BLOCK_SIZE * 16, BLOCK_SIZE * 15)
  new Coin(scene, BLOCK_SIZE * 18, BLOCK_SIZE * 14)
  new Brick(scene, BLOCK_SIZE * 11, BLOCK_SIZE * 14)
  new ItemBlock(scene, BLOCK_SIZE * 12, BLOCK_SIZE * 14, false, 'coin')

  new ItemBlock(scene, BLOCK_SIZE * 10, BLOCK_SIZE * 14, false, 'stacheroom')

  new ItemBlock(scene, BLOCK_SIZE * 10, BLOCK_SIZE * 11, true, 'fire-stache')

  new FireBarBlock(scene, BLOCK_SIZE * 18, BLOCK_SIZE * 12)

  scene.setupCamera(BLOCK_SIZE * 32)
}
