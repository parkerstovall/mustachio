import Phaser from 'phaser'
import {
  BLOCK_SIZE,
  GAME_HEIGHT,
  PLAYER_WALK_SPEED,
  PLAYER_SPRINT_SPEED,
  ITEM_SIZE,
  COIN_SIZE,
  PLAYER_STOMP_BOUNCE_VELOCITY,
  FALL_DEATH_MARGIN,
  STOMP_DETECTION_MARGIN,
  PIPE_STROKE_WIDTH,
  COIN_STROKE_WIDTH,
  COIN_ARC_PADDING,
  FALLING_FLOOR_STROKE_WIDTH,
  FLOOR_TOP_COLOR,
  FLOOR_BOTTOM_COLOR,
  PIPE_FILL_COLOR,
  PIPE_STROKE_COLOR,
  CAVE_WALL_COLOR,
  COIN_FILL_COLOR,
  COIN_STROKE_COLOR,
  STACHEROOM_COLOR,
  FIRE_STACHE_COLOR,
  FALLING_FLOOR_FILL_COLOR,
  FALLING_FLOOR_STROKE_COLOR,
  STACHE_BALL_COLOR,
  BRICK_DEBRIS_COLOR,
  LASER_FILL_COLOR,
  LASER_WIDTH,
  LASER_TEXTURE_HEIGHT,
  BALL_CANVAS_SIZE,
  BALL_ARC_CENTER,
  BALL_ARC_RADIUS,
} from '../constants'
import { Mustachio } from '../objects/player/Mustachio'
import type { Enemy } from '../objects/enemies/Enemy'
import type { FireBar } from '../objects/projectiles/FireBar'

import type { ItemBlock } from '../objects/blocks/ItemBlock'
import { loadImages } from './_sceneHelpers/load-assets'
import { Item } from '../objects/items/Item'
import { levelOne } from '../levels/level-one'
import { StacheSeed } from '../objects/enemies/StacheSeed'
import { FallingFloor } from '../objects/blocks/FallingFloor'

export type LevelFunction = (
  scene: GameScene,
  previousLevels?: string[],
) => void

export interface GameSceneData {
  levelKey?: LevelFunction
  previousLevels?: string[]
  playerBig?: boolean
  playerFire?: boolean
}

export class GameScene extends Phaser.Scene {
  // Physics groups
  platforms!: Phaser.Physics.Arcade.StaticGroup
  enemies!: Phaser.Physics.Arcade.Group
  stacheShots!: Phaser.Physics.Arcade.Group
  stacheSeeds!: Phaser.Physics.Arcade.Group
  items!: Phaser.Physics.Arcade.Group
  playerProjectiles!: Phaser.Physics.Arcade.Group
  enemyProjectiles!: Phaser.Physics.Arcade.Group
  breakables!: Phaser.Physics.Arcade.StaticGroup
  fallingFloors!: Phaser.Physics.Arcade.Group

  debug: boolean = false

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
  private hiddenBlocks: ItemBlock[] = []
  private isPaused = false

  constructor() {
    super({ key: 'GameScene' })
  }

  preload() {
    loadImages(this)
  }

  create(data?: GameSceneData) {
    this.gameOver = false
    this.hasWon = false
    this.isStatic = false
    this.fireBars = []
    this.hiddenBlocks = []
    this.isPaused = false
    this.debug = this.game.config.physics?.arcade?.debug === true

    // Generate procedural textures
    this.generateProceduralTextures()

    // Physics groups
    this.platforms = this.physics.add.staticGroup()
    this.enemies = this.physics.add.group({ allowGravity: false })
    this.stacheShots = this.physics.add.group({ allowGravity: false })
    this.stacheSeeds = this.physics.add.group({ allowGravity: false })
    this.items = this.physics.add.group()
    this.playerProjectiles = this.physics.add.group()
    this.enemyProjectiles = this.physics.add.group({ allowGravity: false })
    this.breakables = this.physics.add.staticGroup()
    this.fallingFloors = this.physics.add.group({ allowGravity: false })

    // Player
    const isBig = data?.playerBig ?? false
    const hasFire = data?.playerFire ?? false
    this.player = new Mustachio(
      this,
      BLOCK_SIZE * 4,
      BLOCK_SIZE * 13,
      isBig,
      hasFire,
    )

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
        this.anims.pauseAll()
        this.time.paused = true
        this.scene.pause('BackgroundScene')
        this.events.emit('pause')
      } else {
        this.physics.resume()
        this.anims.resumeAll()
        this.time.paused = false
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
    // if (data?.score) {
    //   this.events.emit('addScore', data.score)
    // }
    this.previousLevels = data?.previousLevels ?? []
    const level = data?.levelKey
    if (level) {
      this.levelFunc = level
      level(this, this.previousLevels)
    } else {
      levelOne(this, this.previousLevels)
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
      fctx.fillStyle = FLOOR_TOP_COLOR
      fctx.fillRect(0, 0, BLOCK_SIZE, BLOCK_SIZE / 3)
      fctx.fillStyle = FLOOR_BOTTOM_COLOR
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
      pctx.fillStyle = PIPE_FILL_COLOR
      pctx.fillRect(0, 0, BLOCK_SIZE * 2, BLOCK_SIZE * 2)
      pctx.strokeStyle = PIPE_STROKE_COLOR
      pctx.lineWidth = PIPE_STROKE_WIDTH
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
      cctx.fillStyle = CAVE_WALL_COLOR
      cctx.fillRect(0, 0, BLOCK_SIZE, BLOCK_SIZE)
      caveCanvas.refresh()
    }

    // Coin texture
    if (!this.textures.exists('coin')) {
      const coinCanvas = this.textures.createCanvas(
        'coin',
        COIN_SIZE,
        COIN_SIZE,
      )!
      const cctx = coinCanvas.context
      cctx.fillStyle = COIN_FILL_COLOR
      cctx.beginPath()
      cctx.arc(
        COIN_SIZE / 2,
        COIN_SIZE / 2,
        COIN_SIZE / 2 - COIN_ARC_PADDING,
        0,
        Math.PI * 2,
      )
      cctx.fill()
      cctx.strokeStyle = COIN_STROKE_COLOR
      cctx.lineWidth = COIN_STROKE_WIDTH
      cctx.stroke()
      coinCanvas.refresh()
    }

    // Stacheroom texture (blue rect)
    if (!this.textures.exists('stacheroom')) {
      const srCanvas = this.textures.createCanvas(
        'stacheroom',
        ITEM_SIZE,
        ITEM_SIZE,
      )!
      const srctx = srCanvas.context
      srctx.fillStyle = STACHEROOM_COLOR
      srctx.fillRect(0, 0, ITEM_SIZE, ITEM_SIZE)
      srCanvas.refresh()
    }

    // FireStache texture (red rect)
    if (!this.textures.exists('fire-stache')) {
      const fsCanvas = this.textures.createCanvas(
        'fire-stache',
        ITEM_SIZE,
        ITEM_SIZE,
      )!
      const fsctx = fsCanvas.context
      fsctx.fillStyle = FIRE_STACHE_COLOR
      fsctx.fillRect(0, 0, ITEM_SIZE, ITEM_SIZE)
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
      ffctx.fillStyle = FALLING_FLOOR_FILL_COLOR
      ffctx.fillRect(0, 0, BLOCK_SIZE, BLOCK_SIZE)
      ffctx.clearRect(
        BLOCK_SIZE / 3,
        BLOCK_SIZE / 3,
        BLOCK_SIZE / 3,
        BLOCK_SIZE / 3,
      )
      ffctx.strokeStyle = FALLING_FLOOR_STROKE_COLOR
      ffctx.lineWidth = FALLING_FLOOR_STROKE_WIDTH
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
      const sbCanvas = this.textures.createCanvas(
        'stache-ball',
        BALL_CANVAS_SIZE,
        BALL_CANVAS_SIZE,
      )!
      const sbctx = sbCanvas.context
      sbctx.fillStyle = STACHE_BALL_COLOR
      sbctx.beginPath()
      sbctx.arc(
        BALL_ARC_CENTER,
        BALL_ARC_CENTER,
        BALL_ARC_RADIUS,
        0,
        Math.PI * 2,
      )
      sbctx.fill()
      sbCanvas.refresh()
    }

    // BrickDebris texture (brown circle)
    if (!this.textures.exists('brick-debris')) {
      const bdCanvas = this.textures.createCanvas(
        'brick-debris',
        BALL_CANVAS_SIZE,
        BALL_CANVAS_SIZE,
      )!
      const bdctx = bdCanvas.context
      bdctx.fillStyle = BRICK_DEBRIS_COLOR
      bdctx.beginPath()
      bdctx.arc(
        BALL_ARC_CENTER,
        BALL_ARC_CENTER,
        BALL_ARC_RADIUS,
        0,
        Math.PI * 2,
      )
      bdctx.fill()
      bdCanvas.refresh()
    }

    // Laser texture (blue rect)
    if (!this.textures.exists('laser')) {
      const lCanvas = this.textures.createCanvas(
        'laser',
        LASER_WIDTH,
        LASER_TEXTURE_HEIGHT,
      )!
      const lctx = lCanvas.context
      lctx.fillStyle = LASER_FILL_COLOR
      lctx.fillRect(0, 0, LASER_WIDTH, LASER_TEXTURE_HEIGHT)
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

    this.physics.add.collider(
      this.player,
      this.fallingFloors,
      this
        .onFallingFloorCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this,
    )

    // Enemies vs falling floors (shouldn't trigger, but should collide)
    this.physics.add.collider(this.enemies, this.fallingFloors)

    // Player vs enemies
    this.physics.add.overlap(
      this.player,
      this.enemies,
      this
        .onPlayerEnemyCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this,
    )

    // Player vs stache seeds
    this.physics.add.overlap(
      this.player,
      this.stacheSeeds,
      this
        .onStacheSeedCollision as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this,
    )

    // Player vs StacheShots
    this.physics.add.overlap(
      this.player,
      this.stacheShots,
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

    // Player projectiles vs stache shots
    this.physics.add.overlap(
      this.playerProjectiles,
      this.stacheShots,
      this
        .onProjectileHitEnemy as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this,
    )

    // Player projectiles vs stache seeds
    this.physics.add.overlap(
      this.playerProjectiles,
      this.stacheSeeds,
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
    this.physics.add.collider(this.playerProjectiles, this.breakables)
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
          this.player.y = blockBottom
        }
      }
    }

    // Fall death
    if (this.player.y > GAME_HEIGHT + FALL_DEATH_MARGIN) {
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
  }

  private onStacheSeedCollision(
    _player: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    stacheSeed: Phaser.Types.Physics.Arcade.GameObjectWithBody,
  ) {
    const enemy = stacheSeed as StacheSeed

    if (enemy.isDead) return

    if (enemy.inPipe) return

    this.player.playerHit()
  }

  private onPlayerEnemyCollision(
    _player: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    enemyObj: Phaser.Types.Physics.Arcade.GameObjectWithBody,
  ) {
    const enemy = enemyObj as Enemy
    const playerBody = this.player.body as Phaser.Physics.Arcade.Body

    if (enemy.isDead) return

    // Stomp check: player moving down and above enemy
    if (
      playerBody.velocity.y > 0 &&
      this.player.y + this.player.height <= enemy.y + STOMP_DETECTION_MARGIN
    ) {
      enemy.enemyHit()
      // Bounce player up
      this.player.setVelocityY(PLAYER_STOMP_BOUNCE_VELOCITY) // Extra bounce for stomping
    } else {
      this.player.playerHit()
    }
  }

  private onCollectItem(
    _player: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    itemObj: Phaser.Types.Physics.Arcade.GameObjectWithBody,
  ) {
    if (itemObj instanceof Item) {
      itemObj.collect()
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

  private onFallingFloorCollision(
    _player: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    floorObj: Phaser.Types.Physics.Arcade.GameObjectWithBody,
  ) {
    if (this.player.body.velocity.y < 0) return // Ignore if player is moving up through it

    const floor = floorObj as FallingFloor
    floor.startFall()
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

  registerHiddenBlock(block: ItemBlock) {
    this.hiddenBlocks.push(block)
  }

  loadLevel(levelFunc: LevelFunction, previousLevels: string[]) {
    const data: GameSceneData = {
      levelKey: levelFunc,
      previousLevels,
      playerBig: this.player.isBig,
      playerFire: this.player.isFire,
    }
    this.scene.restart(data)
  }

  setupCamera(levelWidth: number) {
    if (!this.isStatic) {
      this.cameras.main.setBounds(0, 0, levelWidth, GAME_HEIGHT)
      this.cameras.main.startFollow(this.player, true, 1, 0)
    }
  }
}
