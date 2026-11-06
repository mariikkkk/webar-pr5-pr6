import { PMREMGenerator } from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export class EnvironmentManager {
  constructor(renderer, scene) {
    const generator = new PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    this.target = generator.fromScene(room, 0.04);
    scene.environment = this.target.texture;
    // The environment lights PBR materials; AR keeps its camera background.
    room.dispose();
    generator.dispose();
  }
  dispose() { this.target.dispose(); }
}
