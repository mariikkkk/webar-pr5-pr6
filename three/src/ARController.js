import * as THREE from 'three';

export class ARController {
  constructor(renderer, scene, model, ui, preview) {
    Object.assign(this, {renderer, scene, model, ui, preview});
    this.reticle = new THREE.Mesh(
      new THREE.RingGeometry(.07, .09, 32).rotateX(-Math.PI / 2),
      new THREE.MeshBasicMaterial({color: 0x35e998})
    );
    this.reticle.matrixAutoUpdate = false;
    this.reticle.visible = false;
    scene.add(this.reticle);
    const controller = renderer.xr.getController(0);
    controller.addEventListener('select', () => {
      if (this.reticle.visible) {
        model.place(this.reticle.matrix);
        ui.message('Объект размещён. Цвет, форма и вращение доступны внизу.');
      }
    });
    scene.add(controller);
    document.querySelector('#place').onclick = () => { this.placeInFront = true; };
  }
  async check() {
    const supported = !!navigator.xr && await navigator.xr.isSessionSupported('immersive-ar').catch(() => false);
    this.ui.start.disabled = !supported;
    this.ui.start.textContent = supported ? 'Начать AR' : 'AR недоступен в этом браузере';
    this.ui.message('Предпросмотр: меняйте цвет, форму и вращение объекта.');
  }
  async start() {
    if (this.session || this.starting) return;
    this.starting = true;
    let session;
    try {
      session = await navigator.xr.requestSession('immersive-ar', {
        requiredFeatures: ['hit-test', 'local-floor', 'dom-overlay'],
        domOverlay: {root: document.querySelector('#overlay')}
      });
      this.session = session;
      session.addEventListener('end', () => this.cleanup(), {once: true});
      this.renderer.xr.setReferenceSpaceType('local-floor');
      await this.renderer.xr.setSession(session);
      const viewer = await session.requestReferenceSpace('viewer');
      const source = await session.requestHitTestSource({space: viewer});
      if (this.session !== session) { source.cancel(); return; }
      this.source = source;
      this.preview.visible = false;
      this.model.root.visible = false;
      this.placeInFront = true;
      this.scene.background = null;
      this.renderer.setClearColor(0x000000, 0);
      this.ui.setAR(true);
      this.ui.message('Объект появится перед камерой. Для переноса на поверхность найдите зелёное кольцо и коснитесь экрана.');
    } catch (error) {
      if (session) await session.end().catch(() => {});
      this.cleanup();
      this.ui.message('Не удалось запустить AR: ' + error.message);
    } finally { this.starting = false; }
  }
  async stop() { if (this.session) await this.session.end(); }
  cleanup() {
    this.source?.cancel();
    this.source = null;
    this.session = null;
    this.placeInFront = false;
    this.reticle.visible = false;
    this.preview.visible = true;
    this.model.root.visible = true;
    this.model.root.position.set(0, 0, 0);
    this.scene.background = new THREE.Color(0xedf1f6);
    this.ui.setAR(false);
    this.ui.message('Предпросмотр. AR-сессия завершена.');
  }
  update(frame) {
    if (!frame || !this.source) return;
    const reference = this.renderer.xr.getReferenceSpace();
    if (this.placeInFront) {
      const viewer = frame.getViewerPose(reference);
      if (viewer) {
        const viewMatrix = new THREE.Matrix4().fromArray(viewer.transform.matrix);
        const point = new THREE.Vector3(0, 0, -0.8).applyMatrix4(viewMatrix);
        point.y -= 0.1;
        this.model.place(new THREE.Matrix4().makeTranslation(point.x, point.y, point.z));
        this.placeInFront = false;
        this.ui.message('Объект установлен перед вами и остаётся в пространстве. «Передо мной» возвращает его в поле зрения.');
      }
    }
    const result = frame.getHitTestResults(this.source)[0];
    const pose = result?.getPose(reference);
    this.reticle.visible = !!pose;
    if (pose) this.reticle.matrix.fromArray(pose.transform.matrix);
  }
}
