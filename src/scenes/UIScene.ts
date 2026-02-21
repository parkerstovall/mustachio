import Phaser from 'phaser'
import {
  BLOCK_SIZE,
  GAME_TIME,
  GAME_WIDTH,
  GAME_HEIGHT,
  TIMER_DELAY,
  UI_FONT_SIZE,
  UI_FONT_SIZE_LARGE,
  UI_STROKE_THICKNESS,
  UI_MESSAGE_STROKE_THICKNESS,
  UI_TIMER_X_MULTIPLIER,
  UI_TEXT_COLOR,
  UI_STROKE_COLOR,
} from '../constants'

export class UIScene extends Phaser.Scene {
  private scoreText!: Phaser.GameObjects.Text
  private timerText!: Phaser.GameObjects.Text
  private messageText!: Phaser.GameObjects.Text
  private score = 0
  private timeLeft = GAME_TIME
  private timerEvent: Phaser.Time.TimerEvent | null = null

  constructor() {
    super({ key: 'UIScene' })
  }

  create() {
    this.score = 0
    this.timeLeft = GAME_TIME

    const style: Phaser.Types.GameObjects.Text.TextStyle = {
      fontSize: UI_FONT_SIZE,
      color: UI_TEXT_COLOR,
      fontFamily: 'monospace',
      stroke: UI_STROKE_COLOR,
      strokeThickness: UI_STROKE_THICKNESS,
    }

    this.scoreText = this.add.text(BLOCK_SIZE, BLOCK_SIZE, 'Score: 0', style)
    this.timerText = this.add.text(
      BLOCK_SIZE * UI_TIMER_X_MULTIPLIER,
      BLOCK_SIZE,
      `Time: ${this.timeLeft}`,
      style,
    )
    this.messageText = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2, '', {
        fontSize: UI_FONT_SIZE_LARGE,
        color: UI_TEXT_COLOR,
        fontFamily: 'monospace',
        stroke: UI_STROKE_COLOR,
        strokeThickness: UI_MESSAGE_STROKE_THICKNESS,
        align: 'center',
      })
      .setOrigin(0.5)

    this.timerEvent = this.time.addEvent({
      delay: TIMER_DELAY,
      loop: true,
      callback: this.timerTick,
      callbackScope: this,
    })

    this.registerGameEvents()
  }

  /** Register listeners on GameScene events. Called on initial create and after restarts. */
  registerGameEvents() {
    const gameScene = this.scene.get('GameScene')

    gameScene.events.on('addScore', (points: number) => {
      this.score += points
      this.scoreText.setText(`Score: ${this.score}`)
    })

    gameScene.events.on('playerDead', () => {
      this.timerEvent?.remove()
      this.messageText.setText('Game Over\nPress R to restart')
    })

    gameScene.events.on('win', () => {
      this.timerEvent?.remove()
      this.messageText.setText('You Win!')
    })

    gameScene.events.on('pause', () => {
      if (this.timerEvent) this.timerEvent.paused = true
    })

    gameScene.events.on('resume', () => {
      if (this.timerEvent) this.timerEvent.paused = false
    })

    gameScene.events.on('restart', () => {
      this.score = 0
      this.timeLeft = GAME_TIME
      this.scoreText.setText('Score: 0')
      this.timerText.setText(`Time: ${this.timeLeft}`)
      this.messageText.setText('')
      if (this.timerEvent) {
        this.timerEvent.remove()
      }
      this.timerEvent = this.time.addEvent({
        delay: TIMER_DELAY,
        loop: true,
        callback: this.timerTick,
        callbackScope: this,
      })
    })
  }

  private timerTick() {
    this.timeLeft--
    this.timerText.setText(`Time: ${this.timeLeft}`)
    if (this.timeLeft <= 0) {
      this.timerEvent?.remove()
      const gameScene = this.scene.get('GameScene')
      gameScene.events.emit('timeUp')
    }
  }
}
