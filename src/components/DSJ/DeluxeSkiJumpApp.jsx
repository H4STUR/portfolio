import React, { useState, useEffect, useRef } from 'react';
import Window from '../Window';
import Phaser from 'phaser';
import '../../styles/window.css';

const DSJ = ({ id, title, onClose, position }) => {
  const [size, setSize] = useState({ width: 800, height: 600 });
  const gameRef = useRef(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: size.width,
      height: size.height,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 1000 },
          debug: false
        }
      },
      scene: {
        preload: preload,
        create: create,
        update: update
      },
      parent: gameRef.current // Attach Phaser to the ref
    };

    const game = new Phaser.Game(config);

    let player;
    let cursors;
    let ramp;
    let landingArea;
    let gameState = 'start'; // 'start', 'inRun', 'takeOff', 'flight', 'landing', 'end'
    let jumpPower = 0;
    let jumpAngle = 0;
    let distanceTraveled = 0;
    let speedometer;
    let angleIndicator;
    let rampPath;
    let takeOffPoint;

    function preload() {
      this.load.image('sky', 'https://labs.phaser.io/assets/skies/sky2.png');
      this.load.image('ground', 'https://labs.phaser.io/assets/sprites/platform.png');
      this.load.image('skier', 'https://labs.phaser.io/assets/sprites/rocket.png'); // Replace with skier image
    }

    function create() {
      this.add.image(size.width / 2, size.height / 2, 'sky');

      // Create the ramp as a curved path
      ramp = this.add.graphics();
      ramp.lineStyle(4, 0x7B3F00, 1);
      rampPath = new Phaser.Curves.Spline([
        new Phaser.Math.Vector2(0, 400),
        new Phaser.Math.Vector2(150, 380),
        new Phaser.Math.Vector2(300, 350),
        new Phaser.Math.Vector2(450, 300),
        new Phaser.Math.Vector2(600, 250)
      ]);
      rampPath.draw(ramp, 64);

      landingArea = this.add.rectangle(size.width - 200, size.height - 50, 800, 100, 0xFFFFFF);
      this.physics.add.existing(landingArea, true);

      // Add player at the top of the ramp
      player = this.physics.add.image(0, 400, 'skier');
      player.setOrigin(0.5, 0.5);
      player.setDisplaySize(30, 30);
      player.setCollideWorldBounds(true);

      cursors = this.input.keyboard.createCursorKeys();

      // Define the take-off point
      takeOffPoint = new Phaser.Math.Vector2(450, 300);

      // Add speedometer and angle indicator
      speedometer = this.add.text(16, 16, 'Speed: 0', { fontSize: '18px', fill: '#000' });
      angleIndicator = this.add.text(16, 40, 'Angle: 0°', { fontSize: '18px', fill: '#000' });

      // Start the player sliding down the ramp
      this.tweens.add({
        targets: player,
        x: takeOffPoint.x,
        y: takeOffPoint.y,
        duration: 2000,
        ease: 'Sine.easeInOut',
        onComplete: () => {
          gameState = 'takeOff';
        }
      });
    }

    function update() {
      switch (gameState) {
        case 'start':
          if (cursors.space.isDown) {
            gameState = 'inRun';
          }
          break;
        case 'takeOff':
          if (cursors.up.isDown && jumpPower < 100) {
            jumpPower += 2;
          } else if (jumpPower > 0) {
            gameState = 'flight';
            player.setVelocity(
              jumpPower * 3,
              -jumpPower * 6
            );
          }
          break;
        case 'flight':
          if (cursors.left.isDown) jumpAngle -= 0.01;
          if (cursors.right.isDown) jumpAngle += 0.01;
          player.setRotation(jumpAngle);
          player.setVelocityX(player.body.velocity.x * 0.99);
          distanceTraveled = player.x - takeOffPoint.x;
          break;
        case 'landing':
          player.setRotation(0);
          player.setVelocityX(player.body.velocity.x * 0.95);
          if (player.body.velocity.x < 10) {
            gameState = 'end';
            setScore(Math.floor(distanceTraveled / 10));
          }
          break;
      }

      // Update speedometer and angle indicator
      speedometer.setText(`Speed: ${Math.floor(player.body.velocity.length())}`);
      angleIndicator.setText(`Angle: ${Math.floor(Phaser.Math.RadToDeg(jumpAngle))}°`);

      // Check for landing
      if (gameState === 'flight' && player.y > size.height - 100) {
        gameState = 'landing';
      }
    }

    return () => {
      game.destroy(true);
    };
  }, [size]);

  return (
    <Window id={id} title={title} onClose={onClose} position={position} size={size} className="dsj-window">
      <div ref={gameRef} style={{ width: '100%', height: '100%' }} />
    </Window>
  );
};

export default DSJ;
