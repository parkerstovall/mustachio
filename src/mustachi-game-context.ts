import { BLOCK_SIZE } from "./shared/constants";
import { GameContext } from "./shared/game-context";
import { Background } from "./classes/game-objects/bg-objects/background";
import { Cloud } from "./classes/game-objects/bg-objects/cloud";
import { Mustachio } from "./classes/game-objects/mustachio";
import { ScoreDisplay } from "./classes/game-objects/ui-objects/score-display";
import { TimerDisplay } from "./classes/game-objects/ui-objects/timer-display";

export class MustachioGameContext extends GameContext {
  protected timeDisplay: TimerDisplay;
  protected scoreDisplay: ScoreDisplay;
  protected readonly gameName = "Mustachio";
  protected readonly player: Mustachio;

  constructor(containerId: string) {
    super(containerId);

    // Start mustachio with default position
    this.player = new Mustachio(this, BLOCK_SIZE * 4, BLOCK_SIZE * 13);
    this.addGameObject(this.player);

    // Add score and timer displays
    this.scoreDisplay = new ScoreDisplay(this, BLOCK_SIZE, BLOCK_SIZE);
    this.timeDisplay = new TimerDisplay(this, BLOCK_SIZE * 28, BLOCK_SIZE);
    this.scoreDisplay.draw(this.uiContext);
    this.timeDisplay.draw(this.uiContext);

    this.addBgObject(new Background(this));
    this.addBgObject(new Cloud(this, BLOCK_SIZE * 2, BLOCK_SIZE * 2));
    this.addBgObject(new Cloud(this, BLOCK_SIZE * 8, BLOCK_SIZE * 3));
    this.addBgObject(new Cloud(this, BLOCK_SIZE * 15, BLOCK_SIZE * 1));
    this.addBgObject(new Cloud(this, BLOCK_SIZE * 23, BLOCK_SIZE * 4));
    this.addBgObject(new Cloud(this, BLOCK_SIZE * 27, BLOCK_SIZE * 2));
  }
}
