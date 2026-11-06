import * as THREE from 'three';

export class ModelManager {
  constructor(scene) {
    this.root = new THREE.Group();
    scene.add(this.root);
    this.material = new THREE.MeshStandardMaterial({
      color: '#2196f3', metalness: 0.45, roughness: 0.28
    });
    this.autoRotate = false;
    this.setModel('cube');
  }
  setModel(kind) {
    const geometry = kind === 'sphere'
      ? new THREE.SphereGeometry(.12, 40, 24)
      : kind === 'torus'
        ? new THREE.TorusGeometry(.085, .035, 20, 48)
        : new THREE.BoxGeometry(.2, .2, .2);
    if (this.mesh) {
      this.root.remove(this.mesh);
      this.mesh.geometry.dispose();
    }
    this.mesh = new THREE.Mesh(geometry, this.material);
    geometry.computeBoundingBox();
    this.mesh.position.y = -geometry.boundingBox.min.y;
    this.root.add(this.mesh);
    this.kind = kind;
  }
  setColor(value) { this.material.color.set(value); }
  rotate(angle) { this.root.rotation.y += angle; }
  update(dt) { if (this.autoRotate) this.rotate(dt * .7); }
  place(matrix) {
    // Horizontal surfaces: preserve UI rotation while updating the hit-test position.
    this.root.position.setFromMatrixPosition(matrix);
    this.root.visible = true;
  }
  reset() {
    this.autoRotate = false;
    this.root.rotation.set(0, 0, 0);
    this.setModel('cube');
    this.setColor('#2196f3');
  }
}
