import {
  getCollisionDirection,
  getReverseDirection,
  outOfBounds,
} from './app-code'
import type { GameObject } from './game-objects/game-object'
import { Player } from './player'
import { RotatingGameObject } from './game-objects/rotating-game-object'
import { direction, type collision } from './types'
import { UpdatingGameObject } from './game-objects/updating-game-object'
import type { ScoreDisplay } from '../classes/game-objects/ui-objects/score-display'
import type { TimerDisplay } from '../classes/game-objects/ui-objects/timer-display'
import { WinDisplay } from '../classes/game-objects/ui-objects/win-display'

export abstract class GameContext {
  score: number = 0
  currentDir: number = direction.NONE
  time: number = 300 // 5 minutes
  xOffset: number = 0

  readonly gravity: number = 0.75
  readonly gameArea: HTMLCanvasElement
  readonly ui: HTMLCanvasElement
  readonly bg: HTMLCanvasElement
  readonly uiContext: CanvasRenderingContext2D
  readonly gameContext: CanvasRenderingContext2D
  readonly bgContext: CanvasRenderingContext2D

  private xSpeed: number
  private readonly walkSpeed
  private readonly sprintSpeed
  private mainLoop: number | null = null
  private timerLoop: number | null = null
  private isStatic: boolean = false
  private gameOver: boolean = false

  private readonly pressedKeys: string[] = []
  private readonly gameObjects: GameObject[] = []
  private readonly uiObjects: GameObject[] = []
  private readonly bgObjects: GameObject[] = []
  protected abstract readonly gameName: string

  // Needs to be initialized in the implementation
  protected abstract readonly player: Player
  protected abstract readonly scoreDisplay: ScoreDisplay
  protected abstract readonly timeDisplay: TimerDisplay

  constructor(containerId: string) {
    if (window.innerWidth <= 1000) {
      this.walkSpeed = 14
    } else {
      this.walkSpeed = 7
    }
    this.xSpeed = this.walkSpeed
    this.sprintSpeed = 14

    const { gameCanvas, bgCanvas, uiCanvas } = this.createGameArea(containerId)
    let result = this.setupCanvas(gameCanvas)
    this.gameArea = result.canvas
    this.gameContext = result.context

    result = this.setupCanvas(uiCanvas)
    this.ui = result.canvas
    this.uiContext = result.context

    result = this.setupCanvas(bgCanvas)
    this.bg = result.canvas
    this.bgContext = result.context

    window.addEventListener('keydown', (event) => this.onKeyDown(event))
    window.addEventListener('keyup', (event) => this.onKeyUp(event))
  }

  getPlayer() {
    return this.player
  }

  addScore(score: number) {
    this.score += score
    this.scoreDisplay.draw(this.uiContext)
  }

  setPlayerLocation(x: number, y: number) {
    if (this.isStatic) {
      this.player.reset(x, y)
    } else {
      this.player.reset(undefined, y)
      this.xOffset = -x
    }
  }

  startMainLoop() {
    if (this.mainLoop) {
      clearInterval(this.mainLoop)
    }

    this.mainLoop = setInterval(() => {
      this.updateGameArea()
    }, 20)

    if (this.timerLoop) {
      clearInterval(this.timerLoop)
    }
    this.timerLoop = setInterval(() => {
      this.timerTick()
    }, 1000)
  }

  stopMainLoop() {
    if (this.mainLoop) {
      clearInterval(this.mainLoop)
      this.mainLoop = null
    }

    if (this.timerLoop) {
      clearInterval(this.timerLoop)
      this.timerLoop = null
    }
  }

  clearLevel() {
    this.isStatic = false
    this.xOffset = 0
    this.stopMainLoop()

    for (const gameObject of this.gameObjects) {
      // JS doesn't support interfaces
      // so we have to check if the object has a dispose method
      if ('dispose' in gameObject && typeof gameObject.dispose === 'function') {
        gameObject.dispose()
      }
    }

    this.gameObjects.splice(0, this.gameObjects.length)
    this.addGameObject(this.player)
  }

  setStatic(isStatic: boolean) {
    this.isStatic = isStatic
  }

  setGameOver() {
    this.currentDir = direction.NONE
    this.gameOver = true
    this.stopTimer()
  }

  // Assign a unique ID to the game object and add it to the gameObjects array
  addGameObject(gameObject: GameObject, beginning: boolean = false) {
    const gameObjectInList = this.gameObjects.find(
      (go) => go.objectId === gameObject.objectId,
    )

    if (gameObjectInList) {
      // If the game object is already in the list, we don't need to add it again
      return
    }

    if (beginning) {
      this.gameObjects.unshift(gameObject)
    } else {
      this.gameObjects.push(gameObject)
    }
  }

  addUIObject(gameObject: GameObject) {
    this.uiObjects.push(gameObject)
  }

  addBgObject(gameObject: GameObject) {
    this.bgObjects.push(gameObject)
    gameObject.draw(this.bgContext)
  }

  removeGameObject(gameObject: GameObject) {
    const index = this.gameObjects.findIndex(
      (go) => go.objectId === gameObject.objectId,
    )
    if (index > -1) {
      this.gameObjects.splice(index, 1)
    }
  }

  removeUIObject(gameObject: GameObject) {
    const index = this.uiObjects.findIndex(
      (go) => go.objectId === gameObject.objectId,
    )
    if (index > -1) {
      this.uiObjects.splice(index, 1)
    }
  }

  removeBgObject(gameObject: GameObject) {
    const index = this.bgObjects.findIndex(
      (go) => go.objectId === gameObject.objectId,
    )
    if (index > -1) {
      this.bgObjects.splice(index, 1)
    }
  }

  restart(levelFunc: (gc: GameContext) => void) {
    this.stopMainLoop()
    this.gameObjects.splice(0, this.gameObjects.length)
    levelFunc(this)
  }

  validateNewObjectId(objectId: number) {
    const gameObject = this.gameObjects.find((go) => go.objectId === objectId)
    return gameObject === undefined
  }

  stopTimer() {
    if (this.timerLoop) {
      clearInterval(this.timerLoop)
      this.timerLoop = null
    }
  }

  private clear() {
    this.gameContext.clearRect(0, 0, this.gameArea.width, this.gameArea.height)
    // this.uiContext.clearRect(0, 0, this.ui.width, this.ui.height)
    // this.bgContext.clearRect(0, 0, this.bg.width, this.bg.height)
  }

  private updateGameArea() {
    this.clear()
    const gameObjectsInUpdateArea = this.getGameObjectsToUpdate()
    const gameObjectCollisions = this.getGameObjectsWithCollisions(
      gameObjectsInUpdateArea,
    )

    if (this.gameOver) {
      this.player.update([])
    }

    // Update the game objects in the game area
    for (const gameObject of gameObjectsInUpdateArea) {
      if (!this.gameOver && gameObject instanceof UpdatingGameObject) {
        const collisions = gameObjectCollisions.get(gameObject.objectId)
        gameObject.update(collisions ?? [])
      }

      gameObject.draw(this.gameContext)
    }

    // The ui layer is never out of bounds
    for (const uiObject of this.uiObjects) {
      uiObject.draw(this.uiContext)
    }

    const canMove = this.player.canMove(this.currentDir)
    if (this.gameOver || !canMove) {
      return
    }

    if (!this.isStatic) {
      // We move the game object opposite to the player
      // to simulate the player moving
      if (this.currentDir === direction.RIGHT) {
        this.xOffset += this.xSpeed
      } else if (this.currentDir === direction.LEFT) {
        this.xOffset -= this.xSpeed
      }
    } else {
      if (this.currentDir === direction.RIGHT) {
        this.player.rect.x -= this.xSpeed
      } else if (this.currentDir === direction.LEFT) {
        this.player.rect.x += this.xSpeed
      }
    }
  }

  private onKeyDown(event: KeyboardEvent) {
    if (this.gameOver || event.repeat) {
      return
    }

    const key = event.key.toLocaleLowerCase().trim()

    if (key === 'p') {
      if (this.mainLoop) {
        this.stopMainLoop()
      } else {
        this.startMainLoop()
      }
    }

    if (this.mainLoop === null) {
      return
    }

    if (this.pressedKeys.includes(key)) {
      return
    }

    this.pressedKeys.push(key)
    this.player.customKeyDown(key)

    if (key === 'arrowleft' || key === 'a') {
      this.currentDir = direction.RIGHT
    } else if (key === 'arrowright' || key === 'd') {
      this.currentDir = direction.LEFT
    } else if (key === 'arrowup' || key === 'w') {
      this.player.jump()
    } else if (key === 'shift') {
      this.xSpeed = this.sprintSpeed
    }
  }

  private onKeyUp(event: KeyboardEvent) {
    if (this.gameOver) {
      return
    }

    const key = event.key.toLocaleLowerCase()

    this.pressedKeys.splice(
      this.pressedKeys.findIndex((pressedKey) => pressedKey === key),
      1,
    )

    this.player.customKeyUp(key)

    if (
      key === 'arrowleft' ||
      key === 'a' ||
      key === 'arrowright' ||
      key === 'd'
    ) {
      if (
        this.pressedKeys.includes('arrowleft') ||
        this.pressedKeys.includes('a')
      ) {
        this.currentDir = direction.RIGHT
      } else if (
        this.pressedKeys.includes('arrowright') ||
        this.pressedKeys.includes('d')
      ) {
        this.currentDir = direction.LEFT
      } else {
        this.currentDir = direction.NONE
      }
    } else if (key === 'shift') {
      this.xSpeed = this.walkSpeed
    }
  }

  private createGameArea(containerId: string) {
    const container = document.getElementById(containerId)
    if (!container) {
      throw new Error(`Container with id ${containerId} not found`)
    }

    // Clear the container
    container.innerHTML = ''
    container.style.position = 'relative'

    const { width, height } = container.getBoundingClientRect()

    const bgCanvas = document.createElement('canvas')
    bgCanvas.id = 'background-layer'
    bgCanvas.style.position = 'absolute'
    bgCanvas.style.inset = '0'
    bgCanvas.style.width = `${width}px`
    bgCanvas.style.height = `${height}px`
    container.appendChild(bgCanvas)

    const gameCanvas = document.createElement('canvas')
    gameCanvas.id = 'game-layer'
    gameCanvas.style.position = 'absolute'
    gameCanvas.style.inset = '0'
    gameCanvas.style.width = `${width}px`
    gameCanvas.style.height = `${height}px`
    container.appendChild(gameCanvas)

    const uiCanvas = document.createElement('canvas')
    uiCanvas.id = 'ui-layer'
    uiCanvas.style.position = 'absolute'
    uiCanvas.style.inset = '0'
    uiCanvas.style.width = `${width}px`
    uiCanvas.style.height = `${height}px`
    container.appendChild(uiCanvas)

    return { gameCanvas, bgCanvas, uiCanvas }
  }

  private setupCanvas(canvas: HTMLCanvasElement) {
    canvas.width = 1920
    canvas.height = 1080
    const context = canvas.getContext('2d') as CanvasRenderingContext2D
    return { canvas, context }
  }

  private timerTick() {
    this.time--
    this.timeDisplay.draw(this.uiContext)
    if (this.time <= 0) {
      if (this.timerLoop) {
        clearInterval(this.timerLoop)
        this.timerLoop = null
      }

      this.isStatic = true
      this.player.playerKill()
    }
  }

  // This function returns an array of game objects that are
  // within the bounds of the game area
  private getGameObjectsToUpdate() {
    return this.gameObjects.filter((gameObject) => {
      return !outOfBounds(gameObject, this)
    })
  }

  // This function checks for collisions between game objects
  // and returns an array of collision objects
  // Each collision object contains the two game objects involved in the collision
  // and the direction of the collision
  // This allows us to handle collisions between game objects without
  // having to check for collisions more than once
  private getGameObjectsWithCollisions(gameObjects: GameObject[]) {
    const collisons: Map<number, collision[]> = new Map()
    for (const gameObject of gameObjects) {
      if (!gameObject.acceptsCollision) {
        continue
      }

      this.getCollisionForGameObject(gameObject, gameObjects, collisons)
    }

    return collisons
  }

  private getCollisionForGameObject(
    gameObject: GameObject,
    gameObjects: GameObject[],
    collisons: Map<number, collision[]>,
  ) {
    for (const otherGameObject of gameObjects) {
      if (!otherGameObject.acceptsCollision) {
        continue
      }

      this.getCollisionForGameObjects(gameObject, otherGameObject, collisons)
    }
  }

  private getCollisionForGameObjects(
    gameObject: GameObject,
    otherGameObject: GameObject,
    collisions: Map<number, collision[]>,
  ) {
    if (gameObject.objectId === otherGameObject.objectId) {
      return
    }

    if (!collisions.has(gameObject.objectId)) {
      collisions.set(gameObject.objectId, [])
    } else {
      // If the game object has already been added to the collisions map
      // we don't need to check for collisions again
      const goCollisions = collisions.get(gameObject.objectId)
      if (goCollisions) {
        const existingCollision = goCollisions.find(
          (collision) =>
            collision.gameObject.objectId === otherGameObject.objectId,
        )

        if (existingCollision) {
          // If the collision already exists, we don't need to check for collisions again
          return
        }
      }
    }

    const collisionDirection = this.getCollisionDirectionForGameObjects(
      gameObject,
      otherGameObject,
    )

    if (collisionDirection !== null) {
      // Add 2 collision objects to the array
      // one for each game object
      const collision = {
        gameObject: otherGameObject,
        collisionDirection,
      }

      const reversedCollision = {
        gameObject: gameObject,
        collisionDirection: getReverseDirection(collisionDirection),
      }

      const goCollisions = collisions.get(gameObject.objectId)
      if (goCollisions) {
        goCollisions.push(collision)
        collisions.set(gameObject.objectId, goCollisions)
      } else {
        collisions.set(gameObject.objectId, [collision])
      }

      const otherGoCollisions = collisions.get(otherGameObject.objectId)
      if (otherGoCollisions) {
        otherGoCollisions.push(reversedCollision)
        collisions.set(otherGameObject.objectId, otherGoCollisions)
      } else {
        collisions.set(otherGameObject.objectId, [reversedCollision])
      }
    }
  }

  private getCollisionDirectionForGameObjects(
    gameObject: GameObject,
    otherGameObject: GameObject,
  ) {
    let collisionDirection: number | null = null
    if (gameObject instanceof RotatingGameObject) {
      if (
        otherGameObject instanceof Player &&
        gameObject.hitDetection(otherGameObject.rect.x, otherGameObject.rect.y)
      ) {
        collisionDirection = direction.NONE
      }
    } else if (otherGameObject instanceof RotatingGameObject) {
      if (
        gameObject instanceof Player &&
        otherGameObject.hitDetection(gameObject.rect.x, gameObject.rect.y)
      ) {
        collisionDirection = direction.NONE
      }
    } else {
      collisionDirection = getCollisionDirection(
        gameObject,
        otherGameObject,
        this.xOffset,
      )
    }

    return collisionDirection
  }

  win() {
    this.addUIObject(new WinDisplay(this))
  }
}
