import Phaser from 'phaser';
import GameScene from './scenes/Gameplay.js';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#87CEEB',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 500 },
      debug: false
    }
  },
  scene: [GameScene]
};

new Phaser.Game(config);