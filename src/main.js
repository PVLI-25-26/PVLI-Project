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
  scene: [GameScene],

  scale: {
    autoCenter: Phaser.Scale.CENTER_BOTH, 
  }
};

new Phaser.Game(config);