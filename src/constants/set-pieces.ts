import { BLOCK_SIZE } from './game'

export const FLAG_SIZE = BLOCK_SIZE * 8
export const PIPE_DEFAULT_SIZE = BLOCK_SIZE * 2

// Cloud animation (px/sec)
export const CLOUD_SPEED_MIN = 12 // 0.2 * 60fps
export const CLOUD_SPEED_RANGE = 18 // 0.3 * 60fps
export const CLOUD_Y_RANGE_MULTIPLIER = 4

// UI text
export const UI_FONT_SIZE = '32px'
export const UI_FONT_SIZE_LARGE = '64px'
export const UI_STROKE_THICKNESS = 4
export const UI_MESSAGE_STROKE_THICKNESS = 6
export const UI_TIMER_X_MULTIPLIER = 28

export const ABOVE_PLAYER_DEPTH = 11
export const BELOW_PLAYER_DEPTH = 9
