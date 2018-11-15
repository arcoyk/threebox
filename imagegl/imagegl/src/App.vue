<template>
  <span>
    <div ref="stage"></div>
  </span>
</template>

<script>
  import * as THREE from 'three';
  import * as TWEEN from 'es6-tween';
  import * as TrackballControls from 'three-trackballcontrols'; 
  import * as POSITIONS from './js/positions' 
  import * as SHADER from './js/shader'
  export default {
    name: 'sample',
    data: function() {
      const atlas = { width: 1280, height: 1280, cols: 10, rows: 10 }
      // === interaction ==
      var mouse = new THREE.Vector2();
      var raycaster = new THREE.Raycaster ();
      // === scene ===
      const scene = new THREE.Scene ();
      // === renderer ===
      const renderer = new THREE.WebGLRenderer ();
      renderer.setSize( window.innerWidth, window.innerHeight );
      // === camera ===
      const width = window.innerWidth
      const height = window.innerHeight
      const camera = new THREE.PerspectiveCamera ( 75, width / height, 0.1, 100000 );
      camera.position.z = 5;
      camera.position.x = 5;
      camera.position.y = 5;
      // === light ===
      const light1 = new THREE.DirectionalLight( 0xffffff );
      light1.position.set( 10, 10, 10 );
      const light2 = new THREE.DirectionalLight( 0xffffff );
      light2.position.set( 10, 0, -10 );
      // === model ===
      // cube
      var g = new THREE.BoxGeometry( 0, 0, 0 )
      var m = new THREE.MeshPhongMaterial()
      var cube = new THREE.Mesh( g, m )
      var loader = new THREE.TextureLoader()
      var texture = loader.load('../static/100-img-atlas.jpg')
      var uniforms = {
        texture: { value: texture },
        repeat: { value: [ atlas.width / atlas.cols, atlas.height / atlas.rows ] }
      }
      var mat = new THREE.ShaderMaterial( {
        vertexShader: SHADER.vshader,
        fragmentShader: SHADER.fshader,
        uniforms: uniforms
      })
      // particles
      var geo = new THREE.BufferGeometry()
      var position_arr = []
      var offset_arr = []
      var N = 100
      for (var i = 0; i < N * 3; i++) {
        position_arr.push( (Math.random() - Math.random()) * 500 )
      }
      for (var i = 0; i < N; i++) {
        var x = Math.floor( Math.random() * (atlas.cols - 1) ) / atlas.cols
        var y = Math.floor( Math.random() * (atlas.rows - 1) ) / atlas.rows
        offset_arr.push( x )
        offset_arr.push( y )
      }
      var position = new THREE.BufferAttribute( new Float32Array( position_arr ), 3 )
      var offset = new THREE.BufferAttribute( new Float32Array( offset_arr ), 2 )
      geo.addAttribute( 'position', position )
      geo.addAttribute( 'offset', offset )
      var mesh = new THREE.Points( geo, mat );
      return {
        tweenFlag: false,
        mouse: mouse,
        raycaster: raycaster,
        scene: scene,
        renderer: renderer,
        camera: camera,
        light1: light1,
        light2: light2,
        cube: cube,
        mesh: mesh
      }
    },

    created () {
      // === sceneにmodel,light, cameraを追加 ===
      this.scene.add( this.camera );
      this.scene.add( this.light1);
      this.scene.add( this.light2);
      this.scene.add( this.mesh );
      this.scene.add( this.cube );
      this.controls = new TrackballControls( this.camera, this.renderBox );
      // document.addEventListener('mouseup', this.onMouseDown, false)
      // setInterval(this.animateCameraPos, 5000)
      // setInterval(this.animateCameraLook, 1000)
    },

    mounted () {
      this.$refs.stage.appendChild(this.renderer.domElement);
      this.animate();
    },

    methods: {
      billboardfy(arr) {
        for (var a of arr) {
          a.quaternion.copy( this.camera.quaternion );
        }
      },

      onMouseDown(e) {
        this.mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
        this.mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, this.camera)
        var ins = this.raycaster.intersectObjects( this.scene.children )
        if (ins.length > 0) {
          var p = ins[0].point
          var geometry2 = new THREE.BoxBufferGeometry( 100, 100, 100 );
          var material2 = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
          var mesh2 = new THREE.Mesh( geometry2, material2 );
          this.scene.add( mesh2 );
          mesh2.position.set(p.x, p.y, p.z)
          this.animateCameraPos(p)
          // this.camera.position.setX(p.x)
          // this.camera.position.setY(p.y)
          // this.camera.position.setZ(p.z + 100)
          // this.animateCameraPos(0, 0, Math.random() * 4000)
        }
      },

      animateCameraLook() {
        const that = this
        const eye = this.camera.quaternion
        that.tweenFlag = true
        that.controls.enabled = false
        const {autoPlay, Easing, onTick, Tween} = TWEEN;
        autoPlay(true)

        that.qa = that.qa || that.qa_left
        if (that.qa._y == that.qa_right._y) {
          that.qa = that.qa_left
        } else {
          that.qa = that.qa_right
        }

        const tween = new TWEEN.Tween(eye)
          .to(that.qa, 500)
          .easing(Easing.Cubic.Out) // 最後で減速する
          .start();
      },

      
      animateCameraPos(tar) {
        const that = this;
        const coords = this.camera.position
        // coords.copy(this.camera.position); // 現在地点
        const destinationVector = tar; // 終着地点
        const DURATION = 500;
        that.tweenFlag = true
        that.zeroVector = new THREE.Vector3()
        that.controls.enabled = false
        const {autoPlay, Easing, onTick, Tween} = TWEEN;
        autoPlay(false)
        const tween = new TWEEN.Tween(coords)
          .to(destinationVector, DURATION)
          .easing(Easing.Cubic.Out)
          .on('update', update)
          .on('complete', complete)
          .start();
        function update() {
          // that.camera.lookAt(that.zeroVector);
        }
        function complete() {
          that.tweenFlag = false;
          that.controls.enabled = true
        }
      },

      animate () {
        requestAnimationFrame( this.animate );
        // this.mesh.rotation.x += 0.05;
        // this.mesh.rotation.y += 0.05;
        // this.mesh.material.uniforms.cameraUp.value = this.camera.up.toArray()
        // this.mesh.material.needsUpdate = true;
        if (this.controls.enabled) {
          this.controls.update(); 
        } else {
          // TWEEN.update();
        }
        this.renderer.render(this.scene, this.camera);
      }

    }
  }
</script>

<style></style>
