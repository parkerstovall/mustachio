import type { collision } from '../../../../shared/types'
import { EnemyProjectile } from './enemy-projectile'
import type { GameContext } from '../../../../shared/game-context'
import type { Enemy } from '../../point-objects/enemies/enemy'
import { Player } from '../../../../shared/player'

export class FireBall extends EnemyProjectile {
  private readonly target: Player
  private readonly tracking: boolean = Math.random() < 0.25

  constructor(gameContext: GameContext, parent: Enemy) {
    super(gameContext, {
      x: parent.rect.x + parent.rect.width / 2,
      y: parent.rect.y + parent.rect.height + 10,
      width: 8,
      height: 8,
    })

    setTimeout(() => {
      this.gameContext.removeGameObject(this)
    }, 5000)

    const player = gameContext.getPlayer()
    if (player) {
      this.target = player
      this.setSpeed()
    } else {
      throw new Error('Player not found')
    }
  }

  update(collisions: collision[]): void {
    for (const collision of collisions) {
      if (collision.gameObject instanceof Player) {
        collision.gameObject.playerHit()
        return
      }

      this.gameContext.removeGameObject(this)
    }

    if (this.rect.x < 0 || this.rect.x > this.gameContext.gameArea.width) {
      this.gameContext.removeGameObject(this)
      return
    }

    if (this.rect.y < 0 || this.rect.y > this.gameContext.gameArea.height) {
      this.gameContext.removeGameObject(this)
      return
    }

    if (this.tracking) {
      this.setSpeed()
    }

    this.rect.x += this.speedX
    this.rect.y += this.speedY
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath()
    ctx.lineWidth = 5
    ctx.fillStyle = 'red'
    ctx.arc(
      this.rect.x + this.gameContext.xOffset,
      this.rect.y,
      this.rect.height,
      0,
      2 * Math.PI,
    )
    ctx.fill()
  }

  private setSpeed() {
    const dx = this.target.rect.x - this.rect.x
    const dy = this.target.rect.y - this.rect.y
    const angle = Math.atan2(dy, dx)

    if (this.tracking) {
      this.speedX = Math.cos(angle) * 1.25
      this.speedY = Math.sin(angle) * 1.25
    } else {
      this.speedX = Math.cos(angle) * 2
      this.speedY = Math.sin(angle) * 2
    }
  }
}
