import Phaser from 'phaser'
import { BLOCK_SIZE, GAME_TIME } from '../constants'

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
      fontSize: '32px',
      color: '#ffffff',
      fontFamily: 'monospace',
      stroke: '#000000',
      strokeThickness: 4,
    }

    this.scoreText = this.add.text(BLOCK_SIZE, BLOCK_SIZE, 'Score: 0', style)
    this.timerText = this.add.text(
      BLOCK_SIZE * 28,
      BLOCK_SIZE,
      `Time: ${this.timeLeft}`,
      style,
    )
    this.messageText = this.add
      .text(960, 540, '', {
        fontSize: '64px',
        color: '#ffffff',
        fontFamily: 'monospace',
        stroke: '#000000',
        strokeThickness: 6,
        align: 'center',
      })
      .setOrigin(0.5)

    this.timerEvent = this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: this.timerTick,
      callbackScope: this,
    })

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
        delay: 1000,
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
