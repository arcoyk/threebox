<template>
  <div ref="stage"></div>
</template>

<script>
  import * as THREE from 'three';
  import * as TrackballControls from 'three-trackballcontrols'; 

  export default {

    name: 'sample',

    data () {
      // === scene ===
      const scene = new THREE.Scene ();

      // === renderer ===
      const renderer = new THREE.WebGLRenderer ();
      renderer.setSize( window.innerWidth, window.innerHeight );

      // === camera ===
      const camera = new THREE.PerspectiveCamera (75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 5;

      // === light ===
      const light = new THREE.DirectionalLight(0xffffff);
      light.position.set(0, 0, 10);

      // === model ===
      const geometry = new THREE.PlaneGeometry(10, 10*.75);
      // const geometry = new THREE.BoxGeometry (1, 1, 1);
      // const material = new THREE.MeshStandardMaterial ({ color: 0x00ff00 });
      const loader = new THREE.TextureLoader();
      const material = new THREE.MeshLambertMaterial({
        map: loader.load('https://s3.amazonaws.com/duhaime/blog/tsne-webgl/assets/cat.jpg')
        });
      const mesh = new THREE.Mesh (geometry, material);

      return {
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
    },

    mounted () {
      // === DOMを追加, animate ===
      this.$refs.stage.appendChild(this.renderer.domElement);
      this.animate();
    },

    methods: {

      animate () {
        requestAnimationFrame( this.animate );

        // this.mesh.rotation.x += 0.05;
        // this.mesh.rotation.y += 0.05;
        this.controls.update(); 

        this.renderer.render(this.scene, this.camera);
      }

    }
  }
</script>

<style></style>
