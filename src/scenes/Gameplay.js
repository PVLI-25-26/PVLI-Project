import Phaser from "phaser";
import {
  platformConfig,
  playerConfig,
  physicsConfig,
} from "../configs/gameplayConfig.js";

export default class Gameplay extends Phaser.Scene {
  constructor() {
    super("Gameplay");
  }

  preload() {}

  create() {
    // Set world gravity
    this.physics.world.gravity.y = physicsConfig.gravityY;

    // Platforms
    this.platforms = this.physics.add.staticGroup();
    this.platformGraphics = this.add.graphics();

    platformConfig.forEach((p) => {
      // draw platform
      const platform = this.add.rectangle(p.x, p.y, p.width, p.height, p.color);

      // Add physics body
      this.physics.add.existing(platform, true); // true = static
      this.platforms.add(platform);
    });

    // Player
    const p = playerConfig;
    this.player = this.add.rectangle(p.x, p.y, p.width, p.height, p.color);
    this.physics.add.existing(this.player);
    this.player.body.setCollideWorldBounds(true);

    this.physics.add.collider(this.player, this.platforms);

    // Controls
    this.cursors = this.input.keyboard.addKeys({
      up: "Space",
      left: "A",
      down: "S",
      right: "D",
    });
  }

  update() {
    const body = this.player.body;
    const { speed, jumpSpeed } = playerConfig;

    // Horizontal movement
    if (this.cursors.left.isDown) {
      body.setVelocityX(-speed);
    } else if (this.cursors.right.isDown) {
      body.setVelocityX(speed);
    } else {
      body.setVelocityX(0);
    }

    // Jump
    if (this.cursors.up.isDown && body.blocked.down) {
      body.setVelocityY(jumpSpeed);
    }
  }
}
