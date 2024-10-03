// App.tsx

"use client"

import React, { useEffect, useRef } from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'

export default function Component() {
  const matrixCanvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = matrixCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // ウィンドウのサイズに合わせてキャンバスをリサイズ
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()

    const fontSize = 14
    let columns = Math.floor(canvas.width / fontSize)
    let drops: number[] = Array(columns).fill(1)

    const matrix = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}"

    function draw() {
      if (!ctx || !canvas) return

      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = '#53bba5'
      ctx.font = fontSize + 'px monospace'

      for (let i = 0; i < drops.length; i++) {
        const text = matrix[Math.floor(Math.random() * matrix.length)]
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }

        drops[i]++
      }
    }

    const intervalId = setInterval(draw, 35)

    const handleResize = () => {
      if (!canvas) return
      resizeCanvas()
      columns = Math.floor(canvas.width / fontSize)
      drops = Array(columns).fill(1)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      clearInterval(intervalId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Three.js OBJモデルをレンダリングするModelコンポーネント
  const Model = () => {
    const obj = useLoader(OBJLoader, '/model.obj')  

    // モデルにプラスチック風のマテリアルを適用
    useEffect(() => {
      obj.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          // 法線を再計算
          child.geometry.computeVertexNormals()
          // マテリアルをプラスチック風に設定
          child.material = new THREE.MeshPhongMaterial({ 
            color: '#53bba5',
            shininess: 10, // 光沢度を高めに設定
            specular: 0xaaaaaa // 鏡面反射色を薄いグレーに設定
          })
        }
      })
    }, [obj])

    return (
      <primitive 
        object={obj} 
        scale={[2, 2, 2]}  // スケールを調整
        position={[0, 0, 0]}  // 位置を調整
      />
    )
  }

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw', backgroundColor: '#000' }}>
      {/* Matrix code rain canvas */}
      <canvas ref={matrixCanvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }} />

      {/* 中央のテキスト */}
      <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10 }}>
        <h1 
          style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            color: '#53bba5',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            whiteSpace: 'nowrap'
          }}
        >
          FUCK IT WE BOL
        </h1>
      </div>

      {/* Three.js Canvas */}
      <div style={{ position: 'fixed', top: 50, left: 0, width: '100%', height: '100%', zIndex: 20 }}>
        <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[0, 0, 10]} intensity={1} />
          <Model />
          <OrbitControls />
        </Canvas>
      </div>
    </div>
  )
}
