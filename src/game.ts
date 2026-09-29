import Phaser from 'phaser';

const WORLD_WIDTH = 2200;
const WORLD_HEIGHT = 1800;
const PLAYER_SPEED = 260;

export function createGame(parent: HTMLDivElement): Phaser.Game {
  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    backgroundColor: '#1b2b22',
    width: parent.clientWidth || 960,
    height: parent.clientHeight || 540,
    render: {
      pixelArt: true,
      antialias: false,
    },
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [
      class CityScene extends Phaser.Scene {
        private player!: Phaser.GameObjects.Arc;
        private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
        private wsad!: Record<string, Phaser.Input.Keyboard.Key>;
        private roads!: Phaser.GameObjects.Graphics;
        private park!: Phaser.GameObjects.Rectangle;
        private blocks!: Phaser.GameObjects.Graphics;

        constructor() {
          super('CityScene');
        }

        create() {
          this.cameras.main.setBackgroundColor('#1b2b22');
          this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

          this.roads = this.add.graphics();
          this.blocks = this.add.graphics();

          this.drawCity();

          this.player = this.add.circle(460, 560, 13, 0xffd166);
          this.player.setDepth(20);
          this.physics?.add.existing(this.player);

          this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
          this.cameras.main.setZoom(1.1);

          this.cursors = this.input.keyboard!.createCursorKeys();
          this.wsad = this.input.keyboard!.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
          }) as Record<string, Phaser.Input.Keyboard.Key>;

          this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            const targetX = pointer.worldX;
            const targetY = pointer.worldY;
            this.player.x = Phaser.Math.Clamp(targetX, 32, WORLD_WIDTH - 32);
            this.player.y = Phaser.Math.Clamp(targetY, 32, WORLD_HEIGHT - 32);
          });
        }

        drawCity() {
          const roadColor = 0x2a2a2d;
          const sidewalkColor = 0x606b6a;
          const grassColor = 0x3a6a4d;
          const buildingColor = 0x7c5a4b;
          const parkColor = 0x4b8e5a;
          const waterColor = 0x4f8ab8;

          this.add.rectangle(WORLD_WIDTH / 2, WORLD_HEIGHT / 2, WORLD_WIDTH, WORLD_HEIGHT, grassColor).setDepth(0);

          this.roads.fillStyle(roadColor, 1);
          this.roads.fillRect(0, 760, WORLD_WIDTH, 230);
          this.roads.fillRect(930, 0, 220, WORLD_HEIGHT);
          this.roads.fillRect(350, 0, 200, WORLD_HEIGHT);

          this.roads.fillStyle(sidewalkColor, 1);
          for (let x = 0; x < WORLD_WIDTH; x += 140) {
            this.roads.fillRect(x, 740, 90, 40);
            this.roads.fillRect(x, 1010, 90, 40);
          }
          for (let y = 0; y < WORLD_HEIGHT; y += 160) {
            this.roads.fillRect(900, y, 40, 90);
            this.roads.fillRect(1160, y, 40, 90);
          }

          this.park = this.add.rectangle(1640, 1090, 700, 460, parkColor).setDepth(1);
          this.add.circle(1630, 1100, 120, 0x7bcf8b).setDepth(2);
          this.add.circle(1910, 1270, 90, 0x7bcf8b).setDepth(2);
          this.add.rectangle(1820, 1200, 500, 70, 0x5aa661).setDepth(2);

          this.add.rectangle(240, 420, 350, 300, 0x5d6f74).setDepth(1);
          this.add.rectangle(760, 420, 260, 280, 0x8d6d4e).setDepth(1);
          this.add.rectangle(1310, 420, 340, 310, 0x6a7f96).setDepth(1);
          this.add.rectangle(1820, 420, 280, 300, 0x8a5e4d).setDepth(1);

          this.add.rectangle(220, 1360, 320, 220, buildingColor).setDepth(1);
          this.add.rectangle(740, 1360, 260, 220, 0x6a7e6d).setDepth(1);
          this.add.rectangle(1310, 1360, 360, 240, 0x7d5d4f).setDepth(1);
          this.add.rectangle(1860, 1360, 260, 220, 0x7d6d4d).setDepth(1);

          this.blocks.fillStyle(waterColor, 1);
          this.blocks.fillRect(30, 120, 220, 180);
          this.blocks.fillRect(1680, 100, 220, 160);

          this.add.text(210, 180, 'PARK', {
            fontFamily: 'Silkscreen, monospace',
            fontSize: '26px',
            color: '#f8f8f8',
          }).setDepth(10);

          this.add.text(1760, 275, 'WATER', {
            fontFamily: 'Silkscreen, monospace',
            fontSize: '24px',
            color: '#f0f9ff',
          }).setDepth(10);

          this.add.rectangle(1920, 760, 90, 170, 0xd9d4aa).setDepth(1);
          this.add.rectangle(1955, 760, 20, 170, 0xf5e58d).setDepth(2);

          for (let i = 0; i < 8; i += 1) {
            const signal = this.add.rectangle(200 + i * 180, 640, 14, 70, 0x2f3b3b).setDepth(3);
            signal.setStrokeStyle(2, 0x171f1d);
            this.add.circle(signal.x, signal.y - 22, 8, 0xffd166).setDepth(4);
            this.add.circle(signal.x, signal.y, 8, 0x6fe191).setDepth(4);
            this.add.circle(signal.x, signal.y + 22, 8, 0xff6f6f).setDepth(4);
          }
        }

        update() {
          let moveX = 0;
          let moveY = 0;

          if (this.cursors.left.isDown || this.wsad.left.isDown) moveX -= 1;
          if (this.cursors.right.isDown || this.wsad.right.isDown) moveX += 1;
          if (this.cursors.up.isDown || this.wsad.up.isDown) moveY -= 1;
          if (this.cursors.down.isDown || this.wsad.down.isDown) moveY += 1;

          if (moveX !== 0 || moveY !== 0) {
            const length = Math.hypot(moveX, moveY) || 1;
            moveX /= length;
            moveY /= length;

            this.player.x = Phaser.Math.Clamp(this.player.x + moveX * PLAYER_SPEED * (1 / 60), 30, WORLD_WIDTH - 30);
            this.player.y = Phaser.Math.Clamp(this.player.y + moveY * PLAYER_SPEED * (1 / 60), 30, WORLD_HEIGHT - 30);
          }
        }
      },
    ],
  });

  return game;
}
