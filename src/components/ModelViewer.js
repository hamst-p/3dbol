import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

function ModelViewer() {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // シーン、カメラ、レンダラーの初期化
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    // サンプルの立方体を追加
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x53bba5 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 10; // カメラ位置を少し遠くに変更

    // アニメーションループ
    const animate = function () {
      requestAnimationFrame(animate);

      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      renderer.render(scene, camera);
    };

    animate();

    // クリーンアップ
    return () => {
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        width: '100%',    // 画面全体にフィットするように変更
        height: '100%',   // 画面全体にフィットするように変更
        position: 'relative',
        zIndex: 1000,     // 必要に応じて最前面に表示
      }}
    />
  );
}

export default ModelViewer;
