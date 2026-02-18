import Phaser from 'phaser'
import { GAME_WIDTH, GAME_HEIGHT, GRAVITY } from './constants'
import { GameScene } from './scenes/GameScene'
import { BackgroundScene } from './scenes/BackgroundScene'
import { UIScene } from './scenes/UIScene'

export function createGameConfig(
  parent: string | HTMLElement,
): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    parent,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: GRAVITY },
        debug: true,
      },
    },
    scene: [GameScene, BackgroundScene, UIScene],
    backgroundColor: '#87CEEB',
  }
}
