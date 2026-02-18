import type { collision } from '../types'
import { GameObject } from './game-object'

export abstract class UpdatingGameObject extends GameObject {
  acceptsCollision = true
  abstract update(collisions: collision[]): void
}
