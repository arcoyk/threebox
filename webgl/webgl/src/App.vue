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
    }
  },
  mounted: function() {
    let that = this
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
    camera.position.z = 3

    // == Renderer ==
    var renderer = new THREE.WebGLRenderer()
    renderer.setSize( w, h )

    // == Geometry ==
    let g = new THREE.BufferGeometry()
    const N = 1000

    let vertices = new Float32Array([
      -0.5, -0.5, 0.0,
       0.5, -0.5, 0.0,
       0.5,  0.5, 0.0,
      -0.5,  0.5, 0.0
    ])

    let indices = new Uint16Array([
      0, 1, 3,
      2, 3, 1,
      3, 1, 0,
      1, 3, 2
    ])

    let colors = new Float32Array([
      1.0, 0.0, 0.0, 1.0,
      1.0, 0.0, 0.0, 1.0,
      1.0, 0.0, 0.0, 1.0
    ])

    g.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) )
    g.setIndex( new THREE.BufferAttribute( indices, 1) )

    // == Material == 
    let m = new THREE.ShaderMaterial({
      vertexShader: SHADER.vshader,
      fragmentShader: SHADER.fshader
    })
    
    var plane = new THREE.Mesh( g, m )
    scene.add( plane )

    // == Create Canvas ==
    let canvas = document.querySelector( 'canvas' )
    if (canvas != null) {
      document.body.removeChild( canvas )
    }
    document.body.appendChild( renderer.domElement )

    // == Render ==
    var render = function() {
      requestAnimationFrame( render )
      renderer.render( scene, camera )
    }
    render()
  }
}

</script>

<style>
</style>
