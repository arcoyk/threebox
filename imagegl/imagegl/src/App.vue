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
      const imageSize = {width: 128, height: 128}
      const atlas = {width: 1280, height: 1280, cols: 10, rows: 10}
      // === interaction ==
      var mouse = new THREE.Vector2();
      var raycaster = new THREE.Raycaster ();
      // === scene ===
      const scene = new THREE.Scene ();
      // === renderer ===
      const renderer = new THREE.WebGLRenderer ();
      renderer.setSize( window.innerWidth, window.innerHeight );
      // === camera ===
      const camera = new THREE.PerspectiveCamera (75, window.innerWidth / window.innerHeight, 0.1, 100000);
      camera.position.z = 10;
      // === light ===
      const light1 = new THREE.DirectionalLight(0xffffff);
      light1.position.set(10, 10, 10);
      const light2 = new THREE.DirectionalLight(0xffffff);
      light2.position.set(-10, -10, -10);
      // === model ===
      var cubes = []
      for (var i = 0; i < 3; i++) {
        var xyz = [0.1, 0.1, 0.1]
        xyz[i] = 0
        var geo = new THREE.BoxGeometry( xyz[0], xyz[1], xyz[2] )
        var col = '#ff0000'
        if (i == 1) {
          col = '#00ff00'
        } else if (i == 2) {
          col = '#0000ff'
        }
        var mat = new THREE.MeshPhongMaterial( { color: col } )
        var cube = new THREE.Mesh( geo, mat )
        cube.position.set( xyz[0] / 2, xyz[1] / 2,  xyz[2] / 2)
        cubes.push( cube )
      }

      var geo = new THREE.BoxGeometry( 0.1, 100, 0.1 )
      var mat = new THREE.MeshPhongMaterial( { color: '#ff00ff' } )

      var loader = new THREE.TextureLoader()
      var material = new THREE.ShaderMaterial( {
        vertexShader: SHADER.vshader,
        fragmentShader: SHADER.fshader,
        wireframe: true,
        uniforms: {
          cameraUp: { type: 'uVec3', value: camera.up.toArray() },
          map: loader.load('../static/100-img-atlas.jpg')
        }
      })

      function createRect() {
        var w = imageSize.width / 2
        var h = imageSize.height / 2
        w = 1.0
        h = 1.0
        const ps = [
        ]
        const ix = [
          0, 1, 2,
          0, 2, 3 
        ]
        const mv = [
          ( Math.random() - Math.random() ) * 10,
          ( Math.random() - Math.random() ) * 10,
          ( Math.random() - Math.random() ) * 10
        ]
        return { position: ps, index: ix, move: mv }
      }


      const N = 10
      var rect = createRect()

      /*
  var instances = new THREE.InstancedBufferGeometry()

  var index = ba( [ 0, 1, 2, 0, 2, 3] , 1 )

  // moves attribute
  var move = []
  const S = 1000
  for (var i = 0; i < N * 3; i++) {
    move.push((Math.random() - Math.random()) * S)
  }
  move = ba( move, 3 )

  instances.addAttribute( 'move', moves )
  instances.addAttribute( 'index', indices )
      */

      var position = []
      var index    = []
      var move     = []
      var NN = 10

      for (var i = 0; i < NN; i++) {
        rect = createRect()
        position = position.concat( rect.position )
        for (var k = 0; k < 6; k++) {
          rect.index[k] += 4 * i
        }
        index = index.concat( rect.index )
        for (var k = 0; k < 4; k++) {
          move = move.concat( rect.move )
        }
      }

      function ba( arr, itemSize ) {
        return new THREE.BufferAttribute( 
          new Float32Array( arr ),
          itemSize
        )
      }

      position  = ba( position, 3 )
      index     = ba( index,    1 )
      move      = ba( move,     3 )

      var geometry = new THREE.BufferGeometry()
      geometry.addAttribute( 'position', position ) 
      geometry.addAttribute( 'index',    index.clone() )
      geometry.addAttribute( 'mindex',   index.clone() )
      geometry.addAttribute( 'move',     move )

      var mesh = new THREE.Mesh (geometry, material);

      return {
        tweenFlag: false,
        mouse: mouse,
        raycaster: raycaster,
        scene: scene,
        renderer: renderer,
        camera: camera,
        light1: light1,
        light2: light2,
        cubes: cubes,
        mesh: mesh
      }
    },

    created () {
      // === sceneにmodel,light, cameraを追加 ===
      this.scene.add( this.camera );
      this.scene.add( this.light1);
      this.scene.add( this.light2);
      this.scene.add( this.mesh );
      for (var cube of this.cubes) {
        this.scene.add( cube );
      }
      this.controls = new TrackballControls( this.camera, this.renderBox );
      // document.addEventListener('mouseup', this.onMouseDown, false)
      // setInterval(this.animateCameraPos, 5000)

      /*
      this.camera.lookAt(new THREE.Vector3(100, 0, 0))
      this.qa_right = (new THREE.Quaternion()).copy(this.camera.quaternion)
      this.camera.lookAt(new THREE.Vector3(-100, 0, 0))
      this.qa_left = (new THREE.Quaternion()).copy(this.camera.quaternion)
      */
      // setInterval(this.animateCameraLook, 1000)
    },

    mounted () {
      // === DOMを追加, animate ===
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
        // z = 5000
        // y = (Math.random() - Math.random()) * 4000
        // x = (Math.random() - Math.random()) * 4000
        const that = this;
        // const coords = new THREE.Vector3()
        const coords = this.camera.position
        // const coords = new THREE.Vector3().copy(this.camera.position)
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
          .easing(Easing.Cubic.Out) // 最後で減速する
          .on('update', update)
          .on('complete', complete)
          .start();

        function update() {
          // that.camera.lookAt(that.zeroVector); // 向きを変えながら移動
        }
        // 終着地点に着き次第、requestAnimationFrameをストップ
        function complete() {
          that.tweenFlag = false;
          that.controls.enabled = true
        }
      },

      animate () {
        requestAnimationFrame( this.animate );
        // this.mesh.rotation.x += 0.05;
        // this.mesh.rotation.y += 0.05;
        this.mesh.material.uniforms.cameraUp.value = this.camera.up.toArray()
        this.mesh.material.needsUpdate = true;
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
