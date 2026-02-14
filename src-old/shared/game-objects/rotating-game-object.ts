import { direction } from '../types'
import { UpdatingGameObject } from './updating-game-object'

export abstract class RotatingGameObject extends UpdatingGameObject {
  protected rotation: number = 0
  protected readonly rotationSpeed: number = 0.01

  hitDetection(playerX: number, playerY: number) {
    // 1. Move player point into firebar's local space (rotated frame)
    const pivotX = this.rect.x + this.rect.width / 2 + this.gameContext.xOffset
    const pivotY = this.rect.y + this.rect.height

    // Translate to pivot
    const dx = playerX - pivotX
    const dy = playerY - pivotY

    // Unrotate the point (rotate opposite direction)
    const sin = Math.sin(-this.rotation)
    const cos = Math.cos(-this.rotation)

    const localX = dx * cos - dy * sin
    const localY = dx * sin + dy * cos

    // 2. Check against firebar's axis-aligned box in local space
    const halfW = this.rect.width / 2
    const height = this.rect.height

    return (
      localX >= -halfW && localX <= halfW && localY >= -height && localY <= 0
    )
  }

  hitDirection(playerX: number, playerY: number) {
    const pivotX = this.rect.x + this.rect.width / 2
    const pivotY = this.rect.y + this.rect.height

    // Translate to pivot
    const dx = playerX - pivotX
    const dy = playerY - pivotY

    // Unrotate the point (rotate opposite direction)
    const sin = Math.sin(-this.rotation)
    const cos = Math.cos(-this.rotation)

    const localX = dx * cos - dy * sin
    const localY = dx * sin + dy * cos

    if (localY < 0) {
      return direction.UP
    } else if (localX < 0) {
      return direction.LEFT
    } else if (localX > 0) {
      return direction.RIGHT
    } else {
      return direction.DOWN
    }
  }
}
