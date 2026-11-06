import * as THREE from 'three';
import {ModelManager} from './ModelManager.js';
import {EnvironmentManager} from './EnvironmentManager.js';
import {UIController} from './UIController.js';
import {ARController} from './ARController.js';

export class App {
  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xedf1f6);
    this.camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, .01, 30);
    this.camera.position.set(.45, .35, .65);
    this.camera.lookAt(0, .08, 0);
    this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    this.renderer.setSize(innerWidth, innerHeight);
    this.renderer.xr.enabled = true;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    document.body.prepend(this.renderer.domElement);
    this.environment = new EnvironmentManager(this.renderer, this.scene);
    this.model = new ModelManager(this.scene);
    this.preview = new THREE.GridHelper(2, 20, 0xadb6c6, 0xd4dbe5);
    this.preview.position.y = -.001;
    this.scene.add(this.preview);
    this.ui = new UIController(this.model, () => this.ar.start(), () => this.ar.stop());
    this.ar = new ARController(this.renderer, this.scene, this.model, this.ui, this.preview);
    this.ar.check();
    let last = 0;
    this.renderer.setAnimationLoop((time, frame) => {
      const dt = last ? Math.min((time - last) / 1000, .05) : 0;
      last = time;
      this.model.update(dt);
      this.ar.update(frame);
      this.renderer.render(this.scene, this.camera);
    });
    addEventListener('resize', () => {
      this.camera.aspect = innerWidth / innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(innerWidth, innerHeight);
    });
  }
}
