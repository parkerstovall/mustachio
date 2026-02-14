import { outOfBounds } from '../app-code'
import { direction, type collision } from '../types'
import { UpdatingGameObject } from './updating-game-object'

export abstract class MovingGameObject extends UpdatingGameObject {
  speedX: number = 0
  speedY: number = 0
  onGround: boolean = false

  leftRightMovement(collisions: collision[]) {
    // The floor is never outside of the canvas
    // so if the object is outside of the canvas
    // we dont use gravity

    this.onGround = outOfBounds(this, this.gameContext)
    for (const collision of collisions) {
      this.handleCollision(collision)
    }

    this.rect.x += this.speedX

    if (!this.onGround) {
      this.rect.y += this.speedY
      this.speedY += this.gameContext.gravity
    }
  }

  protected handleCollision(collision: collision) {
    if (collision.collisionDirection === direction.DOWN) {
      this.onGround = true
      this.rect.y = collision.gameObject.rect.y - this.rect.height
      this.speedY = 0
    } else if (collision.collisionDirection === direction.UP) {
      this.speedY = 1
      this.rect.y =
        collision.gameObject.rect.y + collision.gameObject.rect.height
    } else if (collision.collisionDirection === direction.LEFT) {
      this.rect.x = collision.gameObject.rect.x - this.rect.width
      this.speedX = -Math.abs(this.speedX)
    } else if (collision.collisionDirection === direction.RIGHT) {
      this.rect.x =
        collision.gameObject.rect.x + collision.gameObject.rect.width
      this.speedX = Math.abs(this.speedX)
    }
  }
}
