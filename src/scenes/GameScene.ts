import Phaser from 'phaser'
import {
  BLOCK_SIZE,
  GAME_HEIGHT,
  PLAYER_WALK_SPEED,
  PLAYER_SPRINT_SPEED,
  PLAYER_JUMP_VELOCITY,
} from '../constants'
import { Mustachio } from '../objects/player/Mustachio'
import type { Enemy } from '../objects/enemies/Enemy'
import type { FireBar } from '../objects/projectiles/FireBar'

// Asset imports
import mustachioImg from '../assets/Mustachio.webp'
import mustachioFacingLeft from '../assets/Mustachio_FacingLeft.webp'
import mustachioFacingRight from '../assets/Mustachio_FacingRight.webp'
import mustachioFire from '../assets/Mustachio_Fire.webp'
import mustachioFacingLeftFire from '../assets/Mustachio_FacingLeft_Fire.webp'
import mustachioFacingRightFire from '../assets/Mustachio_FacingRight_Fire.webp'
import brickImg from '../assets/brick.webp'
import cannonDown from '../assets/cannonDown.webp'
import cannonLeft from '../assets/cannonLeft.webp'
import cannonRight from '../assets/cannonRight.webp'
import cannonUp from '../assets/cannonUp.webp'
import fallingFloorImg from '../assets/fallingFloor.webp'
import homesteadImg from '../assets/homestead.webp'
import homesteadClosedImg from '../assets/homesteadClosed.webp'
import itemBlockImg from '../assets/itemBlock.webp'
import obstacleBrickImg from '../assets/obstacleBrick.webp'
import punchedBlockImg from '../assets/punchedBlock.webp'
import stacheSeed1Img from '../assets/stacheSeed1.webp'
import stacheSeed2Img from '../assets/stacheSeed2.webp'
import stacheSeedReversed1Img from '../assets/stacheSeedReversed1.webp'
import stacheSeedReversed2Img from '../assets/stacheSeedReversed2.webp'
import stacheShotDownImg from '../assets/stacheShotDown.webp'
import stacheShotLeftImg from '../assets/stacheShotLeft.webp'
import stacheShotRightImg from '../assets/stacheShotRight.webp'
import stacheShotUpImg from '../assets/stacheShotUp.webp'
import stacheSlinger1Img from '../assets/stacheSlinger1.webp'
import stacheSlinger2Img from '../assets/stacheSlinger2.webp'
import stacheStalkerImg from '../assets/stacheStalker.webp'
import stacheStalkerReversedImg from '../assets/stacheStalkerReversed.webp'
import stacheStreaker1Img from '../assets/stacheStreaker1.webp'
import stacheStreaker2Img from '../assets/stacheStreaker2.webp'

export type LevelFunction = (
  scene: GameScene,
  previousLevels?: string[],
) => void

export interface GameSceneData {
  levelKey?: LevelFunction
  previousLevels?: string[]
  score?: number
}

export class GameScene extends Phaser.Scene {
  // Physics groups
  platforms!: Phaser.Physics.Arcade.StaticGroup
  enemies!: Phaser.Physics.Arcade.Group
  items!: Phaser.Physics.Arcade.Group
  playerProjectiles!: Phaser.Physics.Arcade.Group
  enemyProjectiles!: Phaser.Physics.Arcade.Group
  breakables!: Phaser.Physics.Arcade.StaticGroup

  // Player
  player!: Mustachio

  // Input
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  wasd!: {
    W: Phaser.Input.Keyboard.Key
    A: Phaser.Input.Keyboard.Key
    S: Phaser.Input.Keyboard.Key
    D: Phaser.Input.Keyboard.Key
  }
  spaceKey!: Phaser.Input.Keyboard.Key
  shiftKey!: Phaser.Input.Keyboard.Key
  pauseKey!: Phaser.Input.Keyboard.Key
  restartKey!: Phaser.Input.Keyboard.Key

  // State
  isStatic = false
  gameOver = false
  hasWon = false
  private levelFunc: LevelFunction | null = null
  previousLevels: string[] = []
  private fireBars: FireBar[] = []
  private hiddenBlocks: import('../objects/blocks/ItemBlock').ItemBlock[] = []
  private isPaused = false

  constructor() {
    super({ key: 'GameScene' })
  }

  preload() {
    // Player sprites
    this.load.image('mustachio', mustachioImg)
    this.load.image('mustachio-left', mustachioFacingLeft)
    this.load.image('mustachio-right', mustachioFacingRight)
    this.load.image('mustachio-fire', mustachioFire)
    this.load.image('mustachio-left-fire', mustachioFacingLeftFire)
    this.load.image('mustachio-right-fire', mustachioFacingRightFire)

    // Block sprites
    this.load.image('brick', brickImg)
    this.load.image('obstacle-brick', obstacleBrickImg)
    this.load.image('item-block', itemBlockImg)
    this.load.image('punched-block', punchedBlockImg)
    this.load.image('falling-floor', fallingFloorImg)

    // Cannon sprites
    this.load.image('cannon-up', cannonUp)
    this.load.image('cannon-down', cannonDown)
    this.load.image('cannon-left', cannonLeft)
    this.load.image('cannon-right', cannonRight)

    // Flag/homestead sprites
    this.load.image('homestead', homesteadImg)
    this.load.image('homestead-closed', homesteadClosedImg)

    // Enemy sprites
    this.load.image('stache-stalker', stacheStalkerImg)
    this.load.image('stache-stalker-reversed', stacheStalkerReversedImg)
    this.load.image('stache-seed-1', stacheSeed1Img)
    this.load.image('stache-seed-2', stacheSeed2Img)
    this.load.image('stache-seed-reversed-1', stacheSeedReversed1Img)
    this.load.image('stache-seed-reversed-2', stacheSeedReversed2Img)
    this.load.image('stache-shot-up', stacheShotUpImg)
    this.load.image('stache-shot-down', stacheShotDownImg)
    this.load.image('stache-shot-left', stacheShotLeftImg)
    this.load.image('stache-shot-right', stacheShotRightImg)
    this.load.image('stache-slinger-1', stacheSlinger1Img)
    this.load.image('stache-slinger-2', stacheSlinger2Img)
    this.load.image('stache-streaker-1', stacheStreaker1Img)
    this.load.image('stache-streaker-2', stacheStreaker2Img)
  }

  create(data?: GameSceneData) {
    this.gameOver = false
    this.hasWon = false
    this.isStatic = false
    this.fireBars = []
    this.hiddenBlocks = []
    this.isPaused = false

    // Generate procedural textures
    this.generateProceduralTextures()

    // Physics groups
    this.platforms = this.physics.add.staticGroup()
    this.enemies = this.physics.add.group({ allowGravity: false })
    this.items = this.physics.add.group()
    this.playerProjectiles = this.physics.add.group()
    this.enemyProjectiles = this.physics.add.group({ allowGravity: false })
    this.breakables = this.physics.add.staticGroup()

    // Player
    this.player = new Mustachio(this, BLOCK_SIZE * 4, BLOCK_SIZE * 13)

    // Input
    this.cursors = this.input.keyboard!.createCursorKeys()
    this.wasd = {
      W: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    }
    this.spaceKey = this.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE,
    )
    this.shiftKey = this.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.SHIFT,
    )
    this.pauseKey = this.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.P,
    )
    this.restartKey = this.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.R,
    )

    // Pause handling
    this.pauseKey.on('down', () => {
      if (this.gameOver) return
      this.isPaused = !this.isPaused
      if (this.isPaused) {
        this.physics.pause()
        this.scene.pause('BackgroundScene')
        this.events.emit('pause')
      } else {
        this.physics.resume()
        this.scene.resume('BackgroundScene')
        this.events.emit('resume')
      }
    })

    // Restart handling is checked in update()

    // Time up event from UI
    this.events.on('timeUp', () => {
      if (!this.gameOver) {
        this.player.playerKill()
      }
    })

    // Collision setup
    this.setupCollisions()

    // Load level
    if (data?.score) {
      this.events.emit('addScore', data.score)
    }
    this.previousLevels = data?.previousLevels ?? []
    const level = data?.levelKey
    if (level) {
      this.levelFunc = level
      level(this, this.previousLevels)
    } else {
      // Default: import level-one dynamically
      import('../levels/level-one').then((mod) => {
        this.levelFunc = mod.levelOne
        mod.levelOne(this, this.previousLevels)
      })
    }

    // Launch parallel scenes and set draw order: Background → Game → UI
    if (!this.scene.isActive('BackgroundScene')) {
      this.scene.launch('BackgroundScene')
    }
    if (!this.scene.isActive('UIScene')) {
      this.scene.launch('UIScene')
    }
    this.scene.sendToBack('BackgroundScene')
    this.scene.bringToTop('UIScene')
  }

  private generateProceduralTextures() {
    // Wall tile (obstacle-brick scaled to BLOCK_SIZE)
    if (!this.textures.exists('wall-tile')) {
      const wallCanvas = this.textures.createCanvas(
        'wall-tile',
        BLOCK_SIZE,
        BLOCK_SIZE,
      )!
      const wctx = wallCanvas.context
      const brickSource = this.textures.get('obstacle-brick').getSourceImage()
      wctx.drawImage(
        brickSource as CanvasImageSource,
        0,
        0,
        BLOCK_SIZE,
        BLOCK_SIZE,
      )
      wallCanvas.refresh()
    }

    // Floor tile (grass top, dirt bottom)
    if (!this.textures.exists('floor-tile')) {
      const floorCanvas = this.textures.createCanvas(
        'floor-tile',
        BLOCK_SIZE,
        BLOCK_SIZE,
      )!
      const fctx = floorCanvas.context
      fctx.fillStyle = 'YellowGreen'
      fctx.fillRect(0, 0, BLOCK_SIZE, BLOCK_SIZE / 3)
      fctx.fillStyle = 'SaddleBrown'
      fctx.fillRect(0, BLOCK_SIZE / 3, BLOCK_SIZE, BLOCK_SIZE - BLOCK_SIZE / 3)
      floorCanvas.refresh()
    }

    // Pipe texture
    if (!this.textures.exists('pipe')) {
      const pipeCanvas = this.textures.createCanvas(
        'pipe',
        BLOCK_SIZE * 2,
        BLOCK_SIZE * 2,
      )!
      const pctx = pipeCanvas.context
      pctx.fillStyle = 'green'
      pctx.fillRect(0, 0, BLOCK_SIZE * 2, BLOCK_SIZE * 2)
      pctx.strokeStyle = 'darkgreen'
      pctx.lineWidth = 2
      pctx.strokeRect(0, 0, BLOCK_SIZE * 2, BLOCK_SIZE * 2)
      pipeCanvas.refresh()
    }

    // Cave wall texture
    if (!this.textures.exists('cave-wall')) {
      const caveCanvas = this.textures.createCanvas(
        'cave-wall',
        BLOCK_SIZE,
        BLOCK_SIZE,
      )!
      const cctx = caveCanvas.context
      cctx.fillStyle = 'DarkSlateGray'
      cctx.fillRect(0, 0, BLOCK_SIZE, BLOCK_SIZE)
      caveCanvas.refresh()
    }

    // Coin texture
    if (!this.textures.exists('coin')) {
      const coinCanvas = this.textures.createCanvas('coin', 30, 30)!
      const cctx = coinCanvas.context
      cctx.fillStyle = 'gold'
      cctx.beginPath()
      cctx.arc(15, 15, 14, 0, Math.PI * 2)
      cctx.fill()
      cctx.strokeStyle = 'black'
      cctx.lineWidth = 1
      cctx.stroke()
      coinCanvas.refresh()
    }

    // Stacheroom texture (blue rect)
    if (!this.textures.exists('stacheroom')) {
      const srCanvas = this.textures.createCanvas('stacheroom', 20, 20)!
      const srctx = srCanvas.context
      srctx.fillStyle = 'blue'
      srctx.fillRect(0, 0, 20, 20)
      srCanvas.refresh()
    }

    // FireStache texture (red rect)
    if (!this.textures.exists('fire-stache')) {
      const fsCanvas = this.textures.createCanvas('fire-stache', 20, 20)!
      const fsctx = fsCanvas.context
      fsctx.fillStyle = 'red'
      fsctx.fillRect(0, 0, 20, 20)
      fsCanvas.refresh()
    }

    // Falling floor texture (bisque with transparent center)
    if (!this.textures.exists('falling-floor-proc')) {
      const ffCanvas = this.textures.createCanvas(
        'falling-floor-proc',
        BLOCK_SIZE,
        BLOCK_SIZE,
      )!
      const ffctx = ffCanvas.context
      ffctx.fillStyle = 'Bisque'
      ffctx.fillRect(0, 0, BLOCK_SIZE, BLOCK_SIZE)
      ffctx.clearRect(
        BLOCK_SIZE / 3,
        BLOCK_SIZE / 3,
        BLOCK_SIZE / 3,
        BLOCK_SIZE / 3,
      )
      ffctx.strokeStyle = 'black'
      ffctx.lineWidth = 2
      ffctx.strokeRect(
        BLOCK_SIZE / 3,
        BLOCK_SIZE / 3,
        BLOCK_SIZE / 3,
        BLOCK_SIZE / 3,
      )
      ffctx.strokeRect(0, 0, BLOCK_SIZE, BLOCK_SIZE)
      ffCanvas.refresh()
    }

    // StacheBall texture (red circle)
    if (!this.textures.exists('stache-ball')) {
      const sbCanvas = this.textures.createCanvas('stache-ball', 16, 16)!
      const sbctx = sbCanvas.context
      sbctx.fillStyle = 'red'
      sbctx.beginPath()
      sbctx.arc(8, 8, 7, 0, Math.PI * 2)
      sbctx.fill()
      sbCanvas.refresh()
    }

    // BrickDebris texture (brown circle)
    if (!this.textures.exists('brick-debris')) {
      const bdCanvas = this.textures.createCanvas('brick-debris', 16, 16)!
      const bdctx = bdCanvas.context
      bdctx.fillStyle = 'brown'
      bdctx.beginPath()
      bdctx.arc(8, 8, 7, 0, Math.PI * 2)
      bdctx.fill()
      bdCanvas.refresh()
    }

    // Laser texture (blue rect)
    if (!this.textures.exists('laser')) {
      const lCanvas = this.textures.createCanvas('laser', BLOCK_SIZE * 0.5, 4)!
      const lctx = lCanvas.context
      lctx.fillStyle = 'blue'
      lctx.fillRect(0, 0, BLOCK_SIZE * 0.5, 4)
      lCanvas.refresh()
    }
  }

  private setupCollisions() {
    // Player vs platforms
    this.physics.add.collider(this.player, this.platforms)

    // Player vs breakables
    this.physics.add.collider(
      this.player,
      this.breakables,
      this
        .onPlayerHitBreakable as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this,
    )

    // Player vs enemies
    this.physics.add.collider(
      this.player,
      this.enemies,
      this
        .onPlayerEnemyCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this,
    )

    // Player vs items (overlap, not collide)
    this.physics.add.overlap(
      this.player,
      this.items,
      this.onCollectItem as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this,
    )

    // Player vs enemy projectiles
    this.physics.add.overlap(
      this.player,
      this.enemyProjectiles,
      this
        .onPlayerHitProjectile as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this,
    )

    // Player projectiles vs enemies
    this.physics.add.overlap(
      this.playerProjectiles,
      this.enemies,
      this
        .onProjectileHitEnemy as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this,
    )

    // Enemies vs platforms
    this.physics.add.collider(this.enemies, this.platforms)
    this.physics.add.collider(this.enemies, this.breakables)

    // Items vs platforms
    this.physics.add.collider(this.items, this.platforms)
    this.physics.add.collider(this.items, this.breakables)

    // Player projectiles vs platforms (bounce)
    this.physics.add.collider(this.playerProjectiles, this.platforms)
  }

  update(_time: number, delta: number) {
    if (this.gameOver) {
      if (Phaser.Input.Keyboard.JustDown(this.restartKey)) {
        this.events.emit('restart')
        this.scene.restart({
          levelKey: this.levelFunc,
          previousLevels: [],
        })
      }
      return
    }
    if (this.isPaused) return

    // Player movement
    this.handlePlayerInput()

    // Check hidden blocks — player hitting from below
    const playerBody = this.player.body
    if (playerBody.velocity.y < 0) {
      for (let i = this.hiddenBlocks.length - 1; i >= 0; i--) {
        const block = this.hiddenBlocks[i]
        if (!block.active || !block.hidden) {
          this.hiddenBlocks.splice(i, 1)
          continue
        }
        const playerRight = this.player.x + playerBody.width
        const playerTop = this.player.y
        const blockRight = block.x + block.displayWidth
        const blockBottom = block.y + block.displayHeight
        // Horizontal overlap and player top touching block bottom
        if (
          playerRight > block.x &&
          this.player.x < blockRight &&
          playerTop <= blockBottom &&
          playerTop >= block.y
        ) {
          block.punch()
          this.player.setVelocityY(0)
          this.hiddenBlocks.splice(i, 1)
        }
      }
    }

    // Fall death
    if (this.player.y > GAME_HEIGHT + 100) {
      this.player.playerKill()
    }

    // Update fire bars (manual hit detection)
    for (const fireBar of this.fireBars) {
      if (fireBar.active) {
        fireBar.updateRotation(delta)
        if (fireBar.hitDetection(this.player.x, this.player.y)) {
          this.player.playerHit()
        }
      }
    }
  }

  private handlePlayerInput() {
    if (this.player.ignoreUpdate) return

    const left = this.cursors.left?.isDown || this.wasd.A.isDown
    const right = this.cursors.right?.isDown || this.wasd.D.isDown
    const down = this.cursors.down?.isDown || this.wasd.S.isDown
    const sprint = this.shiftKey.isDown
    const fire = Phaser.Input.Keyboard.JustDown(this.spaceKey)

    const speed = sprint ? PLAYER_SPRINT_SPEED : PLAYER_WALK_SPEED

    if (left) {
      this.player.setVelocityX(-speed)
      this.player.updateTexture('left')
    } else if (right) {
      this.player.setVelocityX(speed)
      this.player.updateTexture('right')
    } else {
      this.player.setVelocityX(0)
    }

    if (
      Phaser.Input.Keyboard.JustDown(this.cursors.up!) ||
      Phaser.Input.Keyboard.JustDown(this.wasd.W)
    ) {
      this.player.jump()
    }

    if (down) {
      this.player.handleDown()
    } else {
      this.player.handleDownRelease()
    }

    if (fire) {
      this.player.fire()
    }

    // Reset jumps when standing on ground (velocity.y === 0 means
    // the player was actually stopped by a surface below, not just
    // catching on a wall edge while falling)
    if (
      this.player.body &&
      this.player.body.blocked.down &&
      this.player.body.velocity.y === 0
    ) {
      this.player.numJumps = 0
    }
  }

  // Collision callbacks
  private onPlayerHitBreakable(
    _player: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    blockObj: Phaser.Types.Physics.Arcade.GameObjectWithBody,
  ) {
    const playerBody = this.player.body as Phaser.Physics.Arcade.Body
    const block = blockObj as Phaser.Physics.Arcade.Sprite

    // Check if player hit from below (jumping up into block)
    if (playerBody.blocked.up && this.player.y > block.y) {
      if (
        'punch' in block &&
        typeof (block as { punch: () => void }).punch === 'function'
      ) {
        // For bricks, only punch if player is big
        if ('isBrick' in block && !this.player.isBig) {
          return
        }
        ;(block as unknown as { punch: () => void }).punch()
      }
    }

    // Check if player landed on a FallingFloor
    if (
      playerBody.blocked.down &&
      'startFall' in block &&
      typeof (block as { startFall: () => void }).startFall === 'function'
    ) {
      ;(block as unknown as { startFall: () => void }).startFall()
    }
  }

  private onPlayerEnemyCollision(
    _player: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    enemyObj: Phaser.Types.Physics.Arcade.GameObjectWithBody,
  ) {
    const enemy = enemyObj as unknown as Enemy
    const playerBody = this.player.body as Phaser.Physics.Arcade.Body

    if (enemy.isDead) return

    // Check if it's a StacheSeed that's in pipe
    if ('inPipe' in enemy && (enemy as { inPipe: boolean }).inPipe) {
      return
    }

    // Stomp check: player moving down and above enemy
    if (
      playerBody.velocity.y > 0 &&
      this.player.y + this.player.height <=
        (enemyObj as Phaser.Physics.Arcade.Sprite).y + 10
    ) {
      enemy.enemyHit()
      // Bounce player up
      this.player.setVelocityY(PLAYER_JUMP_VELOCITY * 0.5)
    } else {
      this.player.playerHit()
    }
  }

  private onCollectItem(
    _player: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    itemObj: Phaser.Types.Physics.Arcade.GameObjectWithBody,
  ) {
    const item = itemObj as Phaser.Physics.Arcade.Sprite

    if (
      'collect' in item &&
      typeof (item as { collect: () => void }).collect === 'function'
    ) {
      ;(item as unknown as { collect: () => void }).collect()
    }
  }

  private onPlayerHitProjectile() {
    this.player.playerHit()
  }

  private onProjectileHitEnemy(
    projectileObj: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    enemyObj: Phaser.Types.Physics.Arcade.GameObjectWithBody,
  ) {
    const enemy = enemyObj as unknown as Enemy
    const projectile = projectileObj as Phaser.Physics.Arcade.Sprite

    if (!enemy.isDead) {
      enemy.enemyHit()
    }
    projectile.destroy()
  }

  // Public helpers for level building
  addScore(points: number) {
    this.events.emit('addScore', points)
  }

  setPlayerLocation(x: number, y: number) {
    this.player.setPosition(x, y)
    if (!this.isStatic) {
      this.cameras.main.startFollow(this.player, true, 1, 0)
    }
  }

  setStatic(isStatic: boolean) {
    this.isStatic = isStatic
    if (isStatic) {
      this.cameras.main.stopFollow()
      this.cameras.main.setScroll(0, 0)
    }
  }

  registerFireBar(fireBar: FireBar) {
    this.fireBars.push(fireBar)
  }

  registerHiddenBlock(block: import('../objects/blocks/ItemBlock').ItemBlock) {
    this.hiddenBlocks.push(block)
  }

  loadLevel(
    levelFunc: LevelFunction,
    previousLevels: string[],
    score?: number,
  ) {
    this.scene.restart({
      levelKey: levelFunc,
      previousLevels,
      score: score ?? 0,
    } as GameSceneData)
  }

  setupCamera(levelWidth: number) {
    if (!this.isStatic) {
      this.cameras.main.setBounds(0, 0, levelWidth, GAME_HEIGHT)
      this.cameras.main.startFollow(this.player, true, 1, 0)
    }
  }
}
