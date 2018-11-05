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
      camera.position.z = 300;

      // === light ===
      const light = new THREE.DirectionalLight(0xffffff);
      light.position.set(0, 0, 10);









      // === model ===
      var material = {}

      if (true) {
        const loader = new THREE.TextureLoader();
        material = new THREE.MeshBasicMaterial({
          map: loader.load('../static/100-img-atlas.jpg')
        });
      } else {
        material = new THREE.ShaderMaterial( {
          vertexShader: SHADER.vshader,
          fragmentShader: SHADER.fshader,
          side: THREE.DoubleSide
        })
      }

      var imageSize = {width: 128, height: 128}
      var atlas = {width: 1280, height: 1280, cols: 10, rows: 10}
      var geometry = new THREE.Geometry();

      for (var i in POSITIONS) {
        const coords = POSITIONS[i]
        coords.x /= 10
        coords.y /= 10
        coords.z /= 100
        coords.z -= 300
        geometry.vertices.push(
          new THREE.Vector3(
            coords.x,
            coords.y,
            coords.z
          ),
          new THREE.Vector3(
            coords.x+imageSize.width,
            coords.y,
            coords.z
          ),
          new THREE.Vector3(
            coords.x+imageSize.width,
            coords.y+imageSize.height,
            coords.z
          ),
          new THREE.Vector3(
            coords.x,
            coords.y+imageSize.height,
            coords.z
          )
        );

        var faceOne = new THREE.Face3(
          geometry.vertices.length-4,
          geometry.vertices.length-3,
          geometry.vertices.length-2
        )

        var faceTwo = new THREE.Face3(
          geometry.vertices.length-4,
          geometry.vertices.length-2,
          geometry.vertices.length-1
        )

        geometry.faces.push(faceOne, faceTwo);

        const k = i % 100
        var xoff = (k % atlas.cols) * (imageSize.width / atlas.width)
        var yoff = Math.floor(k / atlas.rows) * (imageSize.height / atlas.height)

        geometry.faceVertexUvs[0].push([
          new THREE.Vector2(xoff, yoff),
          new THREE.Vector2(xoff + 0.1, yoff),
          new THREE.Vector2(xoff + 0.1, yoff + 0.1)
        ]);

        geometry.faceVertexUvs[0].push([
          new THREE.Vector2(xoff, yoff),
          new THREE.Vector2(xoff + 0.1, yoff + 0.1),
          new THREE.Vector2(xoff, yoff + 0.1)
        ]);

        if (i > 10) {
          break
        }
      }

      // var geometry = new THREE.PlaneGeometry( 100, 100 );
      var mesh = new THREE.Mesh (geometry, material);
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
