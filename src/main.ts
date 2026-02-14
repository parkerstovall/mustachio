import Phaser from 'phaser'
import { createGameConfig } from './config'

export const startMustachio = (containerId: string) => {
  const container = document.getElementById(containerId)
  if (!container) {
    throw new Error(`Container with id "${containerId}" not found`)
  }

  return new Phaser.Game(createGameConfig(container))
}
