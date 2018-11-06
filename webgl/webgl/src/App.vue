<template>
  <div id="app">
  </div>
</template>

<script>

import * as THREE from 'three'
import * as SHADER from './js/shader'

export default {
  name: 'App',
  data: function() {
    return {
      plane: {},
      r: 1.0
    }
  },
  mounted: function() {
    let that = this
    function onMouseMove( e ) {
      that.r = (e.clientX / 627) * 2 * Math.PI
      // that.plane.geometry.uniforms.r.value = that.r
      that.plane.material.uniforms.r.value = that.r
    }
    document.addEventListener( 'mousemove', onMouseMove )
    let w = 2000
    let h = 1000
    w /= 2.6
    h /= 1.6

    // == Scene ==
    let scene = new THREE.Scene()

    // == Camera ==
    let camera = new THREE.PerspectiveCamera(
      75,
      w / h,
      0.1,
      50
    )
    camera.position.z = 10

    // == Renderer ==
    var renderer = new THREE.WebGLRenderer()
    renderer.setSize( w, h )

    // == Geometry ==
    let g = new THREE.BufferGeometry()
    let vs = []
    const N = 1000
    for (var i = 0; i < N; i++) {
      let offset = {
        x: (Math.random() - Math.random()) * 5,
        y: (Math.random() - Math.random()) * 5,
        z: (Math.random() - Math.random()) * 5
      }
      vs.push(0.0 + offset.x)
      vs.push(0.0 + offset.y)
      vs.push(0.0 + offset.z)

      vs.push((Math.random() - Math.random()) + offset.x)
      vs.push((Math.random() - Math.random()) + offset.y)
      vs.push((Math.random() - Math.random()) + offset.z)

      vs.push((Math.random() - Math.random()) + offset.x)
      vs.push((Math.random() - Math.random()) + offset.y)
      vs.push((Math.random() - Math.random()) + offset.z)
    }

    let vertices = new Float32Array([
      -0.5, -0.5, 0.0,
       0.5, -0.5, 0.0,
       0.5,  0.5, 0.0,
      -0.5,  0.5, 0.0
    ])

    vertices = new Float32Array(vs)

    let ds = []
    for (var i = 0; i < 3 * N; i++) {
      ds.push(i);
    }

    let indices = new Uint16Array([
      0, 1, 3,
      2, 3, 1,
      3, 1, 0,
      1, 3, 2
    ])

    indices = new Uint16Array(ds)

    let cs = []
    for (var i = 0; i < 3 * N; i++) {
      // cs.push(i / (3 * N))
      cs.push(1.0)
      cs.push(0.0)
      cs.push(0.0)
      cs.push(1.0)
    }

    let colors = new Float32Array([
      1.0, 0.0, 0.0, 1.0,
      1.0, 0.0, 0.0, 1.0,
      1.0, 0.0, 0.0, 1.0
    ])

    colors = new Float32Array(cs)

    g.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) )
    g.setIndex( new THREE.BufferAttribute( indices, 1) )
    g.addAttribute( 'color', new THREE.BufferAttribute( colors, 3) )

    // == Material == 
    let m = new THREE.ShaderMaterial({
      uniforms: {
        r: { value: this.r }
      },
      vertexShader: SHADER.vshader,
      fragmentShader: SHADER.fshader
    })
    
    this.plane = new THREE.Mesh(g, m)
    scene.add(this.plane)

    // == Create Canvas ==
    let canvas = document.querySelector( 'canvas' )
    if (canvas != null) {
      document.body.removeChild( canvas )
    }
    document.body.appendChild( renderer.domElement )

    // == Render ==
    var render = function() {
      requestAnimationFrame( render )
      // plane.rotation.x += 0.005
      // plane.rotation.y += 0.005
      renderer.render( scene, camera )
    }
    render()
  }
}

</script>

<style>
</style>
