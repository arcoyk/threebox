<template>
  <span>
    <div ref="stage"></div>
    <script type="text/x-shader" id="vshader">
    </script>
    <script type="text/x-shader" id="fshader">
      void main() {
          gl_FragColor = vec4( 1.0, 1.0, 1.0, 1.0 );
      }
    </script>
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
      camera.position.z = 2000;
      // === light ===
      const light = new THREE.DirectionalLight(0xffffff);
      light.position.set(0, 0, 10);
      // === model ===

      var loader = new THREE.TextureLoader()
      var material = new THREE.ShaderMaterial( {
        vertexShader: SHADER.vshader,
        fragmentShader: SHADER.fshader,
        wireframe: true,
        uniforms: {
          map: loader.load('../static/100-img-atlas.jpg')
        }
      })

      function createRect( c ) {
        const w = imageSize.width / 2
        const h = imageSize.height / 2
        const ps = [
          c.x + w, c.y + h, c.z,
          c.x - w, c.y + h, c.z,
          c.x - w, c.y - h, c.z,

          c.x - w, c.y - h, c.z,
          c.x + w, c.y - h, c.z,
          c.x + w, c.y + h, c.z
        ]
        const ix = [
          0, 1, 2,
          2, 3, 0
        ]
        return { positions: ps, indices: ix }
      }

      const N = 100

      // Base geometry
      var base = new THREE.BufferGeometry()
      const rect = createRect( { x: 0, y: 0, z: 0 } )
      // const positionAttribute = new THREE.Float32BufferAttribute( rect.positions, 3 )
      // const indices = new THREE.Uint16BufferAttribute( rect.indices, 1 ) 
      var positions = new Float32Array( rect.positions )
      var indices = new Uint16Array( rect.indices )
      var positionAttribute = new THREE.BufferAttribute( positions, 3 )
      var indexAttribute = new THREE.BufferAttribute( indices, 1 )
      base.addAttribute( 'position', positionAttribute )
      // setIndex doesn't work...
      base.setIndex( indexAttribute )

      // Instance buffer
      var instances = new THREE.InstancedBufferGeometry()
      var vertices = base.attributes.position.clone()
      instances.addAttribute( 'position', vertices )

      // Uniform for each instance
      var buf = new Float32Array( N * 3 )
      var trans = new THREE.InstancedBufferAttribute( buf, 3, false, 1 )
      const S = 1000
      for (var i = 0; i < N; i++) {
        var x = (Math.random() - Math.random()) * S
        var y = (Math.random() - Math.random()) * S
        var z = (Math.random() - Math.random()) * S
        trans.setXYZ(i, x, y, z)
      }
      instances.addAttribute( 'trans', trans )

      // var geometry = new THREE.PlaneGeometry( 100, 100 );
      var mesh = new THREE.Mesh (instances, material);
      mesh.position.z = 5

      return {
        tweenFlag: false,
        mouse: mouse,
        raycaster: raycaster,
        scene: scene,
        renderer: renderer,
        camera: camera,
        light: light,
        mesh: mesh
      }
    },
    created () {
      // === sceneにmodel,light, cameraを追加 ===
      this.scene.add( this.camera );
      this.scene.add( this.light);
      this.scene.add( this.mesh );
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
