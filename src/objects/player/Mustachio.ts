import Phaser from 'phaser'
import {
  PLAYER_SIZE,
  PLAYER_BIG_WIDTH,
  PLAYER_BIG_HEIGHT,
  PLAYER_JUMP_VELOCITY,
  STACHE_BALL_SPEED,
  PLAYER_DEPTH,
  MAX_JUMPS,
  PLAYER_FIRE_COOLDOWN,
  PLAYER_BALL_OFFSET_LEFT,
  PLAYER_BALL_OFFSET_RIGHT,
  PLAYER_INVULNERABILITY_DURATION,
  PLAYER_HIT_FLASH_ALPHA,
  PLAYER_HIT_FLASH_DURATION,
  PLAYER_HIT_FLASH_REPEAT,
  PLAYER_DEAD_DEPTH,
  PLAYER_DEATH_PAUSE,
  PLAYER_DEATH_RISE,
  PLAYER_DEATH_RISE_DURATION,
  PLAYER_DEATH_FALL_TARGET,
  PLAYER_DEATH_FALL_DURATION,
  PLAYER_SIZE_CHANGE_DURATION,
  PLAYER_POWERUP_FLASH_ALPHA,
  PLAYER_POWERUP_FLASH_DURATION,
  PLAYER_POWERUP_FLASH_REPEAT,
  PLAYER_WIN_WALK_DURATION,
  PLAYER_WIN_DELAY,
  PLAYER_UNCROUCH_Y_DIVISOR,
  WARP_PIPE_ENTRY_OVERLAP,
  WARP_PIPE_ENTRY_DURATION,
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
    this.setDepth(PLAYER_DEPTH)
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
    if (this.numJumps >= MAX_JUMPS) return
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
    this.scene.time.delayedCall(PLAYER_FIRE_COOLDOWN, () => {
      this.canFireProjectile = true
    })

    const dirX =
      this.facingDirection === 'left' ? -STACHE_BALL_SPEED : STACHE_BALL_SPEED
    const ballX =
      this.facingDirection === 'left'
        ? this.x - PLAYER_BALL_OFFSET_LEFT
        : this.x + this.body.width + PLAYER_BALL_OFFSET_RIGHT
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
    this.hitTimer = this.scene.time.delayedCall(
      PLAYER_INVULNERABILITY_DURATION,
      () => {
        this.hitTimer = null
      },
    )

    // Flash effect
    this.scene.tweens.add({
      targets: this,
      alpha: PLAYER_HIT_FLASH_ALPHA,
      duration: PLAYER_HIT_FLASH_DURATION,
      yoyo: true,
      repeat: PLAYER_HIT_FLASH_REPEAT,
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
    this.setDepth(PLAYER_DEAD_DEPTH)

    // Death animation: pause, then rise and fall via tween
    this.scene.time.delayedCall(PLAYER_DEATH_PAUSE, () => {
      this.scene.tweens.add({
        targets: this,
        y: this.y - PLAYER_DEATH_RISE,
        duration: PLAYER_DEATH_RISE_DURATION,
        ease: 'Quad.easeOut',
        onComplete: () => {
          // Now fall off screen
          this.scene.tweens.add({
            targets: this,
            y: this.scene.cameras.main.scrollY + PLAYER_DEATH_FALL_TARGET,
            duration: PLAYER_DEATH_FALL_DURATION,
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
      duration: PLAYER_SIZE_CHANGE_DURATION,

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
        alpha: PLAYER_POWERUP_FLASH_ALPHA,
        duration: PLAYER_POWERUP_FLASH_DURATION,
        yoyo: true,
        repeat: PLAYER_POWERUP_FLASH_REPEAT,
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
      duration: PLAYER_WIN_WALK_DURATION,
      onComplete: () => {
        this.setTexture('mustachio')
        this.setDisplaySize(PLAYER_SIZE, PLAYER_SIZE)
        this.scene.time.delayedCall(PLAYER_WIN_DELAY, () => {
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
      this.y -= fullHeight / PLAYER_UNCROUCH_Y_DIVISOR
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
      y: pipe.y + WARP_PIPE_ENTRY_OVERLAP,
      duration: WARP_PIPE_ENTRY_DURATION,
      onComplete: () => {
        this.warpPipe = null
        this.ignoreUpdate = false
        this.body.setAllowGravity(true)
        pipe.enter()
      },
    })
  }
}
