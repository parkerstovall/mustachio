import Phaser from 'phaser'
import {
  PLAYER_SIZE,
  PLAYER_BIG_WIDTH,
  PLAYER_BIG_HEIGHT,
  PLAYER_JUMP_VELOCITY,
  STACHE_BALL_SPEED,
} from '../../constants'
import type { GameScene } from '../../scenes/GameScene'
import { StacheBall } from '../projectiles/StacheBall'
import type { WarpPipe } from '../set-pieces/WarpPipe'

export class Mustachio extends Phaser.Physics.Arcade.Sprite {
  declare scene: GameScene
  declare body: Phaser.Physics.Arcade.Body

  isBig = false
  isFire = false
  numJumps = 0
  ignoreUpdate = false

  private hitTimer: Phaser.Time.TimerEvent | null = null
  private canFireProjectile = true
  private crouched = false
  private warpPipe: WarpPipe | null = null
  private facingDirection: 'left' | 'right' | 'front' = 'front'

  constructor(scene: GameScene, x: number, y: number) {
    super(scene, x, y, 'mustachio')
    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.setOrigin(0, 0)
    this.setDisplaySize(PLAYER_SIZE, PLAYER_SIZE)
    this.body.setOffset(0, 0)
    this.setCollideWorldBounds(false)
    this.setDepth(10)
  }

  updateTexture(dir: 'left' | 'right' | 'front') {
    this.facingDirection = dir
    const w = this.displayWidth
    const h = this.displayHeight
    if (dir === 'left') {
      this.setTexture(this.isFire ? 'mustachio-left-fire' : 'mustachio-left')
    } else if (dir === 'right') {
      this.setTexture(this.isFire ? 'mustachio-right-fire' : 'mustachio-right')
    } else {
      this.setTexture(this.isFire ? 'mustachio-fire' : 'mustachio')
    }
    this.setDisplaySize(w, h)
  }

  jump() {
    if (this.numJumps >= 2) return
    this.setVelocityY(PLAYER_JUMP_VELOCITY)
    this.numJumps++
  }

  handleDown() {
    if (this.warpPipe) {
      this.goDownPipe()
    } else {
      this.toggleCrouch(true)
    }
  }

  handleDownRelease() {
    this.toggleCrouch(false)
  }

  setWarpPipe(pipe: WarpPipe | null) {
    this.warpPipe = pipe
  }

  fire() {
    if (!this.isFire || !this.canFireProjectile) return

    this.canFireProjectile = false
    this.scene.time.delayedCall(250, () => {
      this.canFireProjectile = true
    })

    const dirX =
      this.facingDirection === 'left' ? -STACHE_BALL_SPEED : STACHE_BALL_SPEED
    const ballX =
      this.facingDirection === 'left'
        ? this.x - 10
        : this.x + this.body.width + 5
    const ballY = this.y + this.body.height / 2

    new StacheBall(this.scene, ballX, ballY, dirX)
  }

  playerHit() {
    if (this.hitTimer !== null || this.scene.gameOver) return

    if (this.isFire) {
      this.changeFire(false)
    } else if (this.isBig) {
      this.toggleCrouch(false)
      this.changeSize(false)
    } else {
      this.playerKill()
      return
    }

    // Invulnerability period
    this.hitTimer = this.scene.time.delayedCall(1000, () => {
      this.hitTimer = null
    })

    // Flash effect
    this.scene.tweens.add({
      targets: this,
      alpha: 0.3,
      duration: 100,
      yoyo: true,
      repeat: 4,
    })
  }

  playerKill() {
    if (this.scene.gameOver) return
    this.scene.gameOver = true
    this.ignoreUpdate = true
    this.setTexture('mustachio')
    this.setDisplaySize(PLAYER_SIZE, PLAYER_SIZE)

    // Disable collisions so player falls through everything
    this.body.setAllowGravity(false)
    this.body.enable = false
    this.setVelocity(0, 0)
    this.setDepth(100)

    // Death animation: pause, then rise and fall via tween
    this.scene.time.delayedCall(500, () => {
      this.scene.tweens.add({
        targets: this,
        y: this.y - 300,
        duration: 500,
        ease: 'Quad.easeOut',
        onComplete: () => {
          // Now fall off screen
          this.scene.tweens.add({
            targets: this,
            y: this.scene.cameras.main.scrollY + 1200,
            duration: 800,
            ease: 'Quad.easeIn',
            onComplete: () => {
              this.scene.events.emit('playerDead')
            },
          })
        },
      })
    })
  }

  changeSize(big: boolean) {
    if (this.isBig === big) return
    this.isBig = big

    const targetW = big ? PLAYER_BIG_WIDTH : PLAYER_SIZE
    const targetH = big ? PLAYER_BIG_HEIGHT : PLAYER_SIZE

    const velocityY = this.body.velocity.y
    this.setVelocityY(0) // Stop vertical movement during size change

    const newY = big
      ? this.y - (targetH - this.displayHeight)
      : this.y + (this.displayHeight - targetH)

    this.scene.tweens.add({
      targets: this,
      displayWidth: targetW,
      displayHeight: targetH,
      y: newY,
      duration: 350,

      onComplete: () => {
        this.setVelocityY(velocityY) // Preserve vertical velocity after tween
      },
    })

    this.updateTexture(this.facingDirection)
  }

  changeFire(fire: boolean) {
    if (this.isFire === fire) return
    this.isFire = fire

    if (fire && !this.isBig) {
      this.changeSize(true)
    }

    this.updateTexture(this.facingDirection)

    // Flash animation for power-up
    if (fire) {
      this.scene.tweens.add({
        targets: this,
        alpha: 0.5,
        duration: 115,
        yoyo: true,
        repeat: 3,
      })
    }
  }

  winGame(flag: Phaser.Physics.Arcade.Sprite) {
    this.ignoreUpdate = true
    this.scene.gameOver = true
    this.scene.hasWon = true
    this.setTexture('mustachio-right')
    this.setDisplaySize(PLAYER_SIZE, PLAYER_SIZE)

    const targetX = flag.x + flag.displayWidth / 2 - PLAYER_SIZE / 1.5

    // Walk toward flag
    this.scene.tweens.add({
      targets: this,
      x: targetX,
      duration: 2000,
      onComplete: () => {
        this.setTexture('mustachio')
        this.setDisplaySize(PLAYER_SIZE, PLAYER_SIZE)
        this.scene.time.delayedCall(1000, () => {
          if ('closeDoor' in flag) {
            ;(flag as unknown as { closeDoor: () => void }).closeDoor()
          }
          this.setVisible(false)
          this.scene.events.emit('win')
        })
      },
    })
  }

  private toggleCrouch(crouch: boolean) {
    if (this.crouched === crouch) return
    this.crouched = crouch

    const currentW = this.isBig ? PLAYER_BIG_WIDTH : PLAYER_SIZE
    const fullHeight = this.isBig ? PLAYER_BIG_HEIGHT : PLAYER_SIZE
    if (crouch) {
      const newHeight = fullHeight / 2
      // Resize first (shrink), then move down to keep feet in place
      this.setDisplaySize(currentW, newHeight)
      this.y += fullHeight / 2
    } else {
      // Move up first, then resize (grow) to keep feet in place
      this.y -= fullHeight / 1.9
      this.setDisplaySize(currentW, fullHeight)
    }
  }

  private goDownPipe() {
    if (!this.warpPipe) return

    this.ignoreUpdate = true
    const pipe = this.warpPipe

    this.x = pipe.x + pipe.displayWidth / 2 - this.body.width / 2
    this.y = pipe.y - this.body.height

    this.updateTexture('front')
    this.body.setAllowGravity(false)
    this.setVelocity(0, 0)

    this.scene.tweens.add({
      targets: this,
      y: pipe.y + 10,
      duration: 500,
      onComplete: () => {
        this.warpPipe = null
        this.ignoreUpdate = false
        this.body.setAllowGravity(true)
        pipe.enter()
      },
    })
  }
}
