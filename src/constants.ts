export const BLOCK_SIZE = 60

// Physics tuning: old engine ran at ~50fps (20ms interval)
// Phaser uses px/sec, so multiply old per-frame values by 50

// Player
export const PLAYER_WALK_SPEED = 350 // 7 * 50
export const PLAYER_SPRINT_SPEED = 700 // 14 * 50
export const PLAYER_JUMP_VELOCITY = -775
export const PLAYER_SIZE = BLOCK_SIZE * 0.66
export const PLAYER_BIG_WIDTH = PLAYER_SIZE + 9
export const PLAYER_BIG_HEIGHT = PLAYER_SIZE + 30

// Gravity: old = 0.75/frame, at 50fps -> 0.75 * 50 * 50 = 1875 px/sec^2
export const GRAVITY = 1875

// Enemies
export const STALKER_SPEED = 50 // 1 * 50
export const STACHE_SEED_SPEED = 75 // 1.5 * 50
export const STACHE_SHOT_SPEED = 150 // 3 * 50
export const STREAKER_SPEED = 50 // 1 * 50
export const SLINGER_SPEED = 75 // 1.5 * 50

// Projectiles
export const STACHE_BALL_SPEED = 250 // 5 * 50
export const STACHE_BALL_BOUNCE_Y = -275 // -5.5 * 50
export const FIREBALL_SPEED = 100 // 2 * 50
export const FIREBALL_TRACKING_SPEED = 62.5 // 1.25 * 50

// Items
export const ITEM_RISE_SPEED = 25 // 0.5 * 50
export const STACHEROOM_SPEED = 100 // 2 * 50

// Game dimensions
export const GAME_WIDTH = 1920
export const GAME_HEIGHT = 1080

// Timer
export const GAME_TIME = 300 // seconds
