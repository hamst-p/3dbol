"use client"

import React, { useEffect, useRef } from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import './App.css'

export default function Component() {
  const matrixCanvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = matrixCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()

    const fontSize = 14
    let columns = Math.floor(canvas.width / fontSize)
    let drops: number[] = Array(columns).fill(1)

    const matrix = "壱弌麤齋纛麺藝顯鸞鸚讃鬱顰蠢驫籠纏馨贄黛ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}"

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

  const Model = () => {
    const obj = useLoader(OBJLoader, '/model.obj')

    useEffect(() => {
      obj.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.computeVertexNormals()
          child.material = new THREE.MeshPhongMaterial({
            color: '#53bba5',
            shininess: 10,
            specular: 0xaaaaaa
          })
        }
      })
    }, [obj])

    return (
      <primitive
        object={obj}
        scale={[2, 2, 2]}
        position={[0, 0, 0]}
      />
    )
  }

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw', backgroundColor: '#000' }}>
      <canvas ref={matrixCanvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }} />

      <header style={{ position: 'absolute', top: 0, width: '100%', zIndex: 10 }}>
        <div className="bol-area">Fuck It We Bol</div>
      </header>

      <div style={{ position: 'fixed', top: 50, left: 0, width: '100%', height: '100%', zIndex: 20 }}>
        <Canvas camera={{ position: [200, 150, 200], fov: 75 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[0, 0, 10]} intensity={1} />
          <Model />
          <OrbitControls />
        </Canvas>
      </div>

      {/* Footer element */}
      <footer style={{
        position: 'absolute',
        bottom: 0,
        width: '100%',
        textAlign: 'center',
        color: '#888888',
        fontSize: '0.8rem',
        padding: '1rem',
        zIndex: 30,
        backgroundColor: '#000' // Ensure visibility
      }}>
        © 2024 by Bolana. All rights reserved.
      </footer>
    </div>
  )
}
