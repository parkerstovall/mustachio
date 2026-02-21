// Asset imports
import mustachioImg from '../../assets/Mustachio.webp'
import mustachioFacingLeft from '../../assets/Mustachio_FacingLeft.webp'
import mustachioFacingRight from '../../assets/Mustachio_FacingRight.webp'
import mustachioFire from '../../assets/Mustachio_Fire.webp'
import mustachioFacingLeftFire from '../../assets/Mustachio_FacingLeft_Fire.webp'
import mustachioFacingRightFire from '../../assets/Mustachio_FacingRight_Fire.webp'
import brickImg from '../../assets/brick.webp'
import cannonDown from '../../assets/cannonDown.webp'
import cannonLeft from '../../assets/cannonLeft.webp'
import cannonRight from '../../assets/cannonRight.webp'
import cannonUp from '../../assets/cannonUp.webp'
import fallingFloorImg from '../../assets/fallingFloor.webp'
import homesteadImg from '../../assets/homestead.webp'
import homesteadClosedImg from '../../assets/homesteadClosed.webp'
import itemBlockImg from '../../assets/itemBlock.webp'
import obstacleBrickImg from '../../assets/obstacleBrick.webp'
import punchedBlockImg from '../../assets/punchedBlock.webp'
import stacheSeed1Img from '../../assets/stacheSeed1.webp'
import stacheSeed2Img from '../../assets/stacheSeed2.webp'
import stacheSeedReversed1Img from '../../assets/stacheSeedReversed1.webp'
import stacheSeedReversed2Img from '../../assets/stacheSeedReversed2.webp'
import stacheShotDownImg from '../../assets/stacheShotDown.webp'
import stacheShotLeftImg from '../../assets/stacheShotLeft.webp'
import stacheShotRightImg from '../../assets/stacheShotRight.webp'
import stacheShotUpImg from '../../assets/stacheShotUp.webp'
import stacheSlinger1Img from '../../assets/stacheSlinger1.webp'
import stacheSlinger2Img from '../../assets/stacheSlinger2.webp'
import stacheStalkerImg from '../../assets/stacheStalker.webp'
import stacheStalkerReversedImg from '../../assets/stacheStalkerReversed.webp'
import stacheStreaker1Img from '../../assets/stacheStreaker1.webp'
import stacheStreaker2Img from '../../assets/stacheStreaker2.webp'

export const loadImages = (scene: Phaser.Scene) => {
  // Player sprites
  scene.load.image('mustachio', mustachioImg)
  scene.load.image('mustachio-left', mustachioFacingLeft)
  scene.load.image('mustachio-right', mustachioFacingRight)
  scene.load.image('mustachio-fire', mustachioFire)
  scene.load.image('mustachio-left-fire', mustachioFacingLeftFire)
  scene.load.image('mustachio-right-fire', mustachioFacingRightFire)

  // Block sprites
  scene.load.image('brick', brickImg)
  scene.load.image('obstacle-brick', obstacleBrickImg)
  scene.load.image('item-block', itemBlockImg)
  scene.load.image('punched-block', punchedBlockImg)
  scene.load.image('falling-floor', fallingFloorImg)

  // Cannon sprites
  scene.load.image('cannon-up', cannonUp)
  scene.load.image('cannon-down', cannonDown)
  scene.load.image('cannon-left', cannonLeft)
  scene.load.image('cannon-right', cannonRight)

  // Flag/homestead sprites
  scene.load.image('homestead', homesteadImg)
  scene.load.image('homestead-closed', homesteadClosedImg)

  // Enemy sprites
  scene.load.image('stache-stalker', stacheStalkerImg)
  scene.load.image('stache-stalker-reversed', stacheStalkerReversedImg)
  scene.load.image('stache-seed-1', stacheSeed1Img)
  scene.load.image('stache-seed-2', stacheSeed2Img)
  scene.load.image('stache-seed-reversed-1', stacheSeedReversed1Img)
  scene.load.image('stache-seed-reversed-2', stacheSeedReversed2Img)
  scene.load.image('stache-shot-up', stacheShotUpImg)
  scene.load.image('stache-shot-down', stacheShotDownImg)
  scene.load.image('stache-shot-left', stacheShotLeftImg)
  scene.load.image('stache-shot-right', stacheShotRightImg)
  scene.load.image('stache-slinger-1', stacheSlinger1Img)
  scene.load.image('stache-slinger-2', stacheSlinger2Img)
  scene.load.image('stache-streaker-1', stacheStreaker1Img)
  scene.load.image('stache-streaker-2', stacheStreaker2Img)
}
