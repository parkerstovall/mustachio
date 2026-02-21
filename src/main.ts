import Phaser from 'phaser'
import { createGameConfig } from './config'
import { MobileControls } from './MobileControls'

export const startMustachio = (containerId: string, debug: boolean = false) => {
  const container = document.getElementById(containerId)
  if (!container) {
    throw new Error(`Container with id "${containerId}" not found`)
  }

  const game = new Phaser.Game(createGameConfig(container, debug))

  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    const mobileControls = new MobileControls(container)
    game.registry.set('mobileControls', mobileControls)
  }

  return game
}
