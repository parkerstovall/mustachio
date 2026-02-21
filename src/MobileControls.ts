const BUTTON_BASE_STYLE = `
  position: absolute;
  width: 11%;
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.22);
  border: 3px solid rgba(255, 255, 255, 0.4);
  border-radius: 50%;
  color: white;
  font-size: 2.5vw;
  font-family: monospace;
  font-weight: bold;
  user-select: none;
  -webkit-user-select: none;
  touch-action: none;
  pointer-events: all;
  cursor: pointer;
  box-sizing: border-box;
`

export class MobileControls {
  left = false
  right = false
  down = false
  jumpPending = false
  firePending = false

  private overlay: HTMLElement
  private abortController = new AbortController()

  constructor(container: HTMLElement) {
    if (getComputedStyle(container).position === 'static') {
      container.style.position = 'relative'
    }

    this.overlay = document.createElement('div')
    this.overlay.style.cssText = `
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 100;
    `
    container.appendChild(this.overlay)
    this.createButtons()
  }

  private addButton(
    label: string,
    positionCss: string,
    onDown: () => void,
    onUp: () => void,
    ariaLabel?: string,
  ): void {
    const btn = document.createElement('div')
    btn.textContent = label
    btn.setAttribute('aria-label', ariaLabel ?? label)
    btn.style.cssText = BUTTON_BASE_STYLE + positionCss

    const signal = this.abortController.signal

    const handleDown = (e: Event) => {
      e.preventDefault()
      onDown()
    }
    const handleUp = (e: Event) => {
      e.preventDefault()
      onUp()
    }

    btn.addEventListener('pointerdown', handleDown, { signal })
    btn.addEventListener('pointerup', handleUp, { signal })
    btn.addEventListener('pointercancel', handleUp, { signal })
    btn.addEventListener('pointerleave', handleUp, { signal })

    this.overlay.appendChild(btn)
  }

  /**
   * Reads and clears a one-shot pending flag. Returns true if the flag was set.
   */
  consumeFlag(flag: 'jumpPending' | 'firePending'): boolean {
    const val = this[flag]
    if (val) this[flag] = false
    return val
  }

  private createButtons() {
    // Left
    this.addButton(
      '◀',
      'left: 2%; bottom: 20%;',
      () => {
        this.left = true
      },
      () => {
        this.left = false
      },
    )

    // Right
    this.addButton(
      '▶',
      'left: 13%; bottom: 20%;',
      () => {
        this.right = true
      },
      () => {
        this.right = false
      },
    )

    // Jump (right side, above fire)
    this.addButton(
      '▲',
      'right: 7.5%; bottom: 33%;',
      () => {
        this.jumpPending = true
      },
      () => {
        /* consumed on next frame */
      },
    )

    // Fire (right side, matches left+right height)
    this.addButton(
      'F',
      'right: 2%; bottom: 20%;',
      () => {
        this.firePending = true
      },
      () => {
        /* consumed on next frame */
      },
      'Fire',
    )

    // Crouch (right side, below fire)
    this.addButton(
      '▼',
      'right: 7.5%; bottom: 5%;',
      () => {
        this.down = true
      },
      () => {
        this.down = false
      },
    )
  }

  destroy() {
    this.abortController.abort()
    this.overlay.remove()
  }
}
