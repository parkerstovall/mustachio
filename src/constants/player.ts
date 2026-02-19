import { BLOCK_SIZE } from './game'

// Physics tuning: old engine ran at ~50fps (20ms interval)
// Phaser uses px/sec, so multiply old per-frame values by 50

export const PLAYER_WALK_SPEED = 350 // 7 * 50
export const PLAYER_SPRINT_SPEED = 625 // 14 * 50
export const PLAYER_JUMP_VELOCITY = -775
export const PLAYER_STOMP_BOUNCE_VELOCITY = PLAYER_JUMP_VELOCITY * 1.25
export const PLAYER_SIZE = BLOCK_SIZE * 0.66
export const PLAYER_BIG_WIDTH = PLAYER_SIZE * 1.5
export const PLAYER_BIG_HEIGHT = PLAYER_SIZE * 2
export const PLAYER_DEPTH = 10
export const MAX_JUMPS = 2
export const PLAYER_FIRE_COOLDOWN = 250
export const PLAYER_BALL_OFFSET_LEFT = 10
export const PLAYER_BALL_OFFSET_RIGHT = 5
export const PLAYER_INVULNERABILITY_DURATION = 1000
export const PLAYER_HIT_FLASH_ALPHA = 0.3
export const PLAYER_HIT_FLASH_DURATION = 100
export const PLAYER_HIT_FLASH_REPEAT = 4
export const PLAYER_DEAD_DEPTH = 100
export const PLAYER_DEATH_PAUSE = 500
export const PLAYER_DEATH_RISE = 300
export const PLAYER_DEATH_RISE_DURATION = 500
export const PLAYER_DEATH_FALL_TARGET = 1200
export const PLAYER_DEATH_FALL_DURATION = 800
export const PLAYER_SIZE_CHANGE_DURATION = 350
export const PLAYER_POWERUP_FLASH_ALPHA = 0.5
export const PLAYER_POWERUP_FLASH_DURATION = 115
export const PLAYER_POWERUP_FLASH_REPEAT = 3
export const PLAYER_WIN_WALK_DURATION = 2000
export const PLAYER_WIN_DELAY = 1000
export const PLAYER_UNCROUCH_Y_DIVISOR = 1.9
export const WARP_PIPE_ENTRY_OVERLAP = 10
export const WARP_PIPE_ENTRY_DURATION = 500
