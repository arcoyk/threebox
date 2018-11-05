<template>
  <div id="app">
  </div>
</template>

<script>

import * as THREE from 'three'
import * as SHADER from './js/shader'

export default {
  name: 'App',
  mounted: function() {
    const w = 400
    const h = 400

    // == Scene ==
    let scene = new THREE.Scene()

    // == Camera ==
    let camera = new THREE.PerspectiveCamera(
      75,
      w / h,
      0.1,
      50
    )
    camera.position.z = 30

    // == Renderer ==
    var renderer = new THREE.WebGLRenderer()
    renderer.setSize( w, h )

    // == Object ==
    let g = new THREE.PlaneGeometry(10, 10, 32)
    var m = new THREE.ShaderMaterial({
      vertexShader: SHADER.vshader,
      fragmentShader: SHADER.fshader
    })
    let plane = new THREE.Mesh(g, m)
    scene.add(plane)

    // == Create Canvas ==
    let canvas = document.querySelector( 'canvas' )
    if (canvas != null) {
      document.body.removeChild( canvas )
    }
    document.body.appendChild( renderer.domElement )

    // == Render ==
    var render = function() {
      requestAnimationFrame( render )
      plane.rotation.x += 0.05
      plane.rotation.y += 0.005
      renderer.render( scene, camera )
    }
    render()
  }
}

</script>

<style>
</style>
