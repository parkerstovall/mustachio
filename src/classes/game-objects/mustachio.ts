import type { GameContext } from "../../shared/game-context";
import { Enemy } from "./point-objects/enemies/enemy";
import { Flag } from "./set-pieces/flag";
import { FireStache } from "./point-objects/items/fire-stache";
import { Item } from "./point-objects/items/item";
import { Stacheroom } from "./point-objects/items/stacheroom";
import { EnemyProjectile } from "./projectiles/enemy-projectiles/enemy-projectile";
import { FallingFloor } from "./set-pieces/obstacles/blocks/falling-floor";
import { WarpPipe } from "./set-pieces/obstacles/warp-pipe";
import { Obstacle } from "./set-pieces/obstacles/obstacle";
import { SetPiece } from "./set-pieces/set-piece";
import { Player } from "../../shared/player";
import { direction, type collision } from "../../shared/types";
import { StacheBall } from "./projectiles/stache-ball";
import { BLOCK_SIZE } from "../../shared/constants";
import { FireBar } from "./projectiles/enemy-projectiles/fire-bar";
import { PunchableBlock } from "./set-pieces/obstacles/blocks/punchable-blockS/punchable-block";
import { ItemBlock } from "./set-pieces/obstacles/blocks/punchable-blockS/item-block";
import { Brick } from "./set-pieces/obstacles/blocks/punchable-blockS/brick";
import { Floor } from "./set-pieces/obstacles/floor";
import { StacheSeed } from "./point-objects/enemies/stache-seed";
import { UpdatingGameObject } from "../../shared/game-objects/updating-game-object";
import { CaveWall } from "./set-pieces/obstacles/blocks/cave-wall";
import mustachio from "../../assets/Mustachio.webp";
import mustachioFacingLeft from "../../assets/Mustachio_FacingLeft.webp";
import mustachioFacingRight from "../../assets/Mustachio_FacingRight.webp";
import mustachioFire from "../../assets/Mustachio_Fire.webp";
import mustachioFacingLeftFire from "../../assets/Mustachio_FacingLeft_Fire.webp";
import mustachioFacingRightFire from "../../assets/Mustachio_FacingRight_Fire.webp";

export class Mustachio extends Player {
  private readonly image = new Image();
  private isFire = false;
  private isBig = false;
  private hitTimer: number | null = null;
  private warpPipe: WarpPipe | null = null;
  private canFire = true;
  private crouched = false;
  protected ignoreUpdate = false;

  constructor(gameContext: GameContext, x: number, y: number) {
    super(gameContext, {
      x,
      y,
      width: BLOCK_SIZE * 0.66,
      height: BLOCK_SIZE * 0.66,
    });

    this.image.src = mustachio;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(
      this.image,
      this.rect.x,
      this.rect.y,
      this.rect.width,
      this.rect.height,
    );
  }

  update(collisions: collision[]): void {
    if (this.ignoreUpdate) {
      return; // Let the goDownPipe method handle the update
    }

    this.blockedDirHor = direction.NONE;
    this.blockedDirVert = direction.NONE;
    this.warpPipe = null;

    for (const collision of collisions) {
      this.handleCollision(collision);
    }

    this.handleGravity();
  }

  goDownPipe() {
    if (this.warpPipe === null) {
      return;
    }

    this.ignoreUpdate = true;
    this.rect.x =
      this.warpPipe.rect.x +
      this.warpPipe.rect.width / 2 -
      this.rect.width / 2 +
      this.gameContext.xOffset;
    this.rect.y = this.warpPipe.rect.y - this.rect.height;

    let downAnimationID: number | null = null;
    const downAnimation = () => {
      if (!this.warpPipe) {
        if (downAnimationID) {
          clearInterval(downAnimationID);
        }
        return;
      }

      this.rect.y += 5;

      if (this.rect.y >= this.warpPipe.rect.y) {
        if (downAnimationID) {
          clearInterval(downAnimationID);
        }

        this.warpPipe.enter();
        this.warpPipe = null;
        this.ignoreUpdate = false;
      }
    };

    downAnimationID = setInterval(downAnimation, 50);
  }

  reset(x?: number, y?: number) {
    this.rect.x = x ?? BLOCK_SIZE * 4.5;
    this.rect.y = y ?? BLOCK_SIZE * 5;
  }

  private changeSize(isBig: boolean) {
    if (this.isBig === isBig) {
      return;
    }

    this.isBig = isBig;

    let runCount = 0;
    let changeID: number | null = null;
    const change = () => {
      if (++runCount > 3 && changeID) {
        clearInterval(changeID);
      }

      if (this.isBig) {
        this.rect.height += 10;
        this.rect.y -= 10;
        this.rect.width += 3;
        this.rect.x -= 1.5;
      } else {
        this.rect.height -= 10;
        this.rect.y += 10;
        this.rect.width -= 3;
        this.rect.x += 1.5;
      }
    };

    changeID = setInterval(change, 115);
  }

  private changeFire(isFire: boolean) {
    if (this.isFire === isFire) {
      return;
    }
    this.isFire = isFire;

    if (this.isFire && !this.isBig) {
      this.changeSize(true);
    }

    let runCount = 0;
    let changeID: number | null = null;
    const change = () => {
      if (runCount < 6) {
        runCount++;
        this.isFire = !this.isFire;
        return;
      }

      if (changeID) {
        clearInterval(changeID);
      }
    };

    changeID = setInterval(change, 115);
  }

  protected handleCollision(collision: collision) {
    if (
      collision.gameObject instanceof UpdatingGameObject &&
      !collision.gameObject.acceptsCollision
    ) {
      return;
    }

    this.handleCollisionGameObject(collision);
    this.handleCollisionDirection(collision);
  }

  private handleCollisionDirection(collision: collision) {
    if (
      collision.gameObject instanceof ItemBlock &&
      collision.gameObject.hidden
    ) {
      return;
    }

    if (collision.gameObject instanceof Item) {
      return;
    }
    const cRect = collision.gameObject.rect;

    if (
      collision.gameObject instanceof Floor ||
      (collision.gameObject instanceof CaveWall && this.rect.y < cRect.y)
    ) {
      if (this.rect.x + this.rect.width < cRect.x + this.gameContext.xOffset) {
        collision.collisionDirection = direction.LEFT;
      } else if (
        this.rect.x >
        cRect.x + cRect.width + this.gameContext.xOffset
      ) {
        collision.collisionDirection = direction.RIGHT;
      } else {
        collision.collisionDirection = direction.DOWN;
      }
    }

    let allowVert =
      this.rect.x + this.rect.width > cRect.x + 10 + this.gameContext.xOffset;
    allowVert =
      allowVert &&
      this.rect.x < cRect.x + cRect.width - 10 + this.gameContext.xOffset;

    if (allowVert && collision.collisionDirection === direction.DOWN) {
      this.blockedDirVert = direction.DOWN;
      this.landOnGameObject(collision.gameObject);
    } else if (allowVert && collision.collisionDirection === direction.UP) {
      this.speedY = 1;
      this.rect.y = cRect.y + cRect.height - 1;
      this.blockedDirVert = direction.UP;
    } else if (
      collision.collisionDirection === direction.LEFT &&
      this.gameContext.currentDir === direction.LEFT
    ) {
      this.speedX = 0;
      this.rect.x = cRect.x - this.rect.width + 1 + this.gameContext.xOffset;
      this.blockedDirHor = direction.LEFT;
    } else if (
      collision.collisionDirection === direction.RIGHT &&
      this.gameContext.currentDir === direction.RIGHT
    ) {
      this.speedX = 0;
      this.rect.x = cRect.x + cRect.width - 1 + this.gameContext.xOffset;
      this.blockedDirHor = direction.RIGHT;
    }
  }

  private handleCollisionGameObject(collision: collision) {
    const gameObject = collision.gameObject;

    // FireBar is a special case since it rotates
    // so it isnt an EnemyProjectile technically
    if (
      gameObject instanceof FireBar ||
      gameObject instanceof EnemyProjectile
    ) {
      this.playerHit();
      return;
    }

    if (gameObject instanceof SetPiece) {
      this.handleCollisionSetPiece(collision.collisionDirection, gameObject);
      return;
    }

    // If the gameObject is an enemy
    if (gameObject instanceof Enemy) {
      this.handleCollisionEnemy(collision.collisionDirection, gameObject);
      return;
    }

    // If the gameobject is an item, collect it and act accordingly
    if (gameObject instanceof Item) {
      this.handleCollisionItem(gameObject);
      return;
    }
  }

  private handleCollisionItem(item: Item) {
    item.collect();

    if (item instanceof Stacheroom) {
      this.changeSize(true);
    } else if (item instanceof FireStache) {
      this.changeFire(true);
    }
  }

  private handleCollisionEnemy(dir: number, enemy: Enemy) {
    if (enemy instanceof StacheSeed) {
      if (!enemy.isDead && !enemy.inPipe) {
        this.playerHit();
      }
    } else if (dir !== direction.DOWN) {
      if (!enemy.isDead) {
        this.playerHit();
      }

      return;
    } else if (dir === direction.DOWN) {
      this.landOnGameObject(enemy);
      enemy.enemyHit();
    }
  }

  private handleCollisionSetPiece(dir: number, setPiece: SetPiece) {
    // The Flag is the goal
    if (setPiece instanceof Flag) {
      this.winGame(setPiece);
      return;
    }

    // If you are on top of a setPiece, set speedY to 0
    // and set the rect.y to the top of the setPiece
    if (dir === direction.DOWN && setPiece instanceof Obstacle) {
      this.handleCollisionObstacle(setPiece);
    } else if (
      this.speedY <= 0 &&
      dir === direction.UP &&
      setPiece instanceof PunchableBlock
    ) {
      if (!(setPiece instanceof Brick) || this.isBig) {
        setPiece.punch();
      }

      this.speedY = 1;
    }
  }

  private handleCollisionObstacle(obstacle: Obstacle) {
    if (obstacle instanceof FallingFloor) {
      obstacle.startFall();
    }

    if (obstacle instanceof WarpPipe) {
      this.warpPipe = obstacle;
    }
  }

  private toggleCrouch(crouch: boolean) {
    if (this.crouched === crouch) {
      return;
    }

    this.crouched = crouch;
    let modifier: number;
    if (crouch) {
      modifier = -(this.rect.height / 2);
    } else {
      modifier = this.rect.height;
    }

    this.rect.y -= modifier;
    this.rect.height += modifier;
  }

  playerHit() {
    if (this.hitTimer !== null) {
      return;
    }

    if (this.isFire) {
      this.changeFire(false);
    } else if (this.isBig) {
      this.toggleCrouch(false);
      this.changeSize(false);
    } else {
      this.playerKill();
    }

    this.hitTimer = setTimeout(() => {
      this.hitTimer = null;
    }, 1000);
  }

  playerKill() {
    this.gameContext.setGameOver();
    this.ignoreUpdate = true;
    this.image.src = mustachio;

    setTimeout(() => {
      this.speedY = -5;

      const deathAnimationTimeout = setInterval(() => {
        this.rect.y += this.speedY;
        this.speedY += 0.06;

        if (this.rect.y > this.gameContext.gameArea.height) {
          clearInterval(deathAnimationTimeout);
          this.gameContext.removeGameObject(this);
          this.gameContext.stopMainLoop();
        }
      });
    }, 1000);
  }

  customKeyDown(key: string): void {
    if (key === "") {
      if (!this.isFire || !this.canFire) {
        return;
      }

      this.canFire = false;
      setTimeout(() => {
        this.canFire = true;
      }, 250);

      const fire = new StacheBall(
        this.gameContext,
        this.rect.x + this.rect.width + 5,
        this.rect.y + this.rect.height / 2,
      );

      fire.speedX = this.gameContext.currentDir === direction.LEFT ? -5 : 5;
      fire.speedY = 0;

      this.gameContext.addGameObject(fire);
    } else if (key === "arrowdown" || key === "s") {
      if (this.warpPipe) {
        if (this.isFire) {
          this.image.src = mustachioFire;
        } else {
          this.image.src = mustachio;
        }

        this.goDownPipe();
      } else {
        this.toggleCrouch(true);
      }
    } else if (key === "arrowleft" || key === "a") {
      if (this.isFire) {
        this.image.src = mustachioFacingLeftFire;
      } else {
        this.image.src = mustachioFacingLeft;
      }
    } else if (key === "arrowright" || key === "d") {
      if (this.isFire) {
        this.image.src = mustachioFacingRightFire;
      } else {
        this.image.src = mustachioFacingRight;
      }
    }
  }

  customKeyUp(key: string): void {
    if (key === "arrowdown" || key === "s") {
      this.toggleCrouch(false);
    }
  }

  winGame(flag: Flag) {
    this.ignoreUpdate = true;
    this.gameContext.setGameOver();
    this.image.src = mustachioFacingRight;

    const targetX =
      flag.rect.x +
      flag.rect.width / 2 -
      this.rect.width / 1.5 +
      this.gameContext.xOffset;

    const winAnimation = setInterval(() => {
      if (this.rect.y + this.rect.height < BLOCK_SIZE * 17) {
        this.rect.y += this.speedY;
        this.speedY += this.gameContext.gravity;
      }

      if (this.rect.x > targetX) {
        clearInterval(winAnimation);
        this.image.src = mustachio;
        setTimeout(() => {
          flag.closeDoor();
          this.gameContext.removeGameObject(this);
          this.gameContext.win();
        }, 1000);
      }

      this.rect.x += 1.5;
    }, 5);
  }
}
