# WebAR — задания 5 и 6

Демонстрация: https://mariikkkk.github.io/webar-pr5-pr6/

- [Three.js](https://mariikkkk.github.io/webar-pr5-pr6/three/) — цвет, форма, поворот, автовращение, PBR и environment map; HTML UI в DOM overlay.
- [Unity](https://mariikkkk.github.io/webar-pr5-pr6/unity/) — готовая WebGL-сборка с De-Panther WebXR Exporter, куб в viewer-space.

## Запуск

Открыть ссылку в Chrome на Android, разрешить камеру и нажать кнопку AR. Проверено на OnePlus 15 CPH2745, Android 17, Chrome 156.0.8078.47. На компьютере работает 3D-предпросмотр.

В Three.js объект получает положение перед камерой однократно и остаётся в координатах пространства. Кнопка «Передо мной» меняет его положение. При видимом зелёном кольце касание вне панели переносит объект на найденную поверхность. В Unity положение и ориентация куба обновляются относительно камеры каждый кадр, поэтому он остаётся в центре экрана; это сценарий viewer-space из задания 6.

## Состав

- `three/` — исходный модульный проект Three.js 0.170.0.
- `unity/` — готовая сборка Unity 6000.6.2f1 с WebXR Exporter 0.25.0; редактор для запуска не нужен.
- `.nojekyll` — публикация статических файлов без обработки Jekyll.

Unity: Compression Format Disabled, Decompression Fallback false, Threads Support false. Размер каталога сборки: 29 086 069 байт.

## Совместимость

В локальной копии `three/vendor/three.module.js` изменён выбор слоя WebXR: для `environmentBlendMode === 'alpha-blend'` используется `XRWebGLLayer`. На проверенном Android Chrome исходный `XRProjectionLayer` не показывал объект поверх камеры. После изменения отображение куба и тора проверено на устройстве. Остальной код Three.js не изменён.

## Зависимости

- [Three.js](https://github.com/mrdoob/three.js), MIT; лицензия в `licenses/three-MIT.txt`.
- [De-Panther WebXR Exporter](https://github.com/De-Panther/unity-webxr-export), Apache-2.0; лицензия и уведомления в `licenses/`.
- Unity WebGL Player собран редактором Unity; условия Unity применяются к компонентам движка.
