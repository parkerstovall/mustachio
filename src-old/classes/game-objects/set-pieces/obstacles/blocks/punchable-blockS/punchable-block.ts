import { Block } from '../block'

export abstract class PunchableBlock extends Block {
  protected abstract punched: boolean
  abstract punch(): void
}
