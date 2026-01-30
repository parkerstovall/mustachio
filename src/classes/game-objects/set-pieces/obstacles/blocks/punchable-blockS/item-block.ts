import type { GameContext } from "../../../../../../shared/game-context";
import type { Item } from "../../../../point-objects/items/item";
import { Coin } from "../../../../point-objects/items/coin";
import { Stacheroom } from "../../../../point-objects/items/stacheroom";
import { FireStache } from "../../../../point-objects/items/fire-stache";
import { PunchableBlock } from "./punchable-block";
import itemBlockImage from "../../../../../../assets/itemBlock.webp";
import punchedBlockImage from "../../../../../../assets/punchedBlock.webp";

export class ItemBlock extends PunchableBlock {
  protected punched = false;
  hidden: boolean;

  private readonly image: HTMLImageElement = new Image();
  private readonly imageSource: string = itemBlockImage;
  private readonly imageSourcePunched: string = punchedBlockImage;

  protected item: new (
    gameContext: GameContext,
    x: number,
    y: number,
    fromItemBlock?: boolean,
  ) => Item;

  constructor(
    gameContext: GameContext,
    x: number,
    y: number,
    hidden: boolean,
    itemType: "coin" | "stacheroom" | "fire-stache",
  ) {
    super(gameContext, x, y);
    this.image.src = this.imageSource;
    this.hidden = hidden;

    switch (itemType) {
      case "coin":
        this.item = Coin;
        break;
      case "stacheroom":
        this.item = Stacheroom;
        break;
      case "fire-stache":
        this.item = FireStache;
        break;
      default:
        throw new Error(`Unknown item type: ${itemType}`);
    }
  }

  punch() {
    if (this.punched) {
      return;
    }

    this.punched = true;
    this.hidden = false;
    this.image.src = this.imageSourcePunched;
    const newItem = new this.item(
      this.gameContext,
      this.rect.x + this.rect.width / 2,
      this.rect.y - this.rect.height,
      true,
    );

    this.gameContext.addGameObject(newItem, true);
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.hidden) {
      return;
    }

    ctx.drawImage(
      this.image,
      this.rect.x + this.gameContext.xOffset,
      this.rect.y,
      this.rect.width,
      this.rect.height,
    );
  }
}
