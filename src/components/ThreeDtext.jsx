import React, { useEffect, useRef } from 'react'
import * as THREE from 'three';
import gsap from 'gsap';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'lil-gui';
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { Font } from 'three/examples/jsm/Addons.js';


const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

function ThreeDtext() {
    const canvasRef = useRef(null);

  useEffect(() => {
    // Debug GUI
    const gui = new GUI({
      title: 'Debug UI Settings',
      width: 300,
      closeFolders: true
    });
    gui.close();

    const toggleGUI = (event) => {
      if (event.key === 'h') {
        gui.show(gui._hidden); // toggle debug UI
      }
    };
    window.addEventListener('keydown', toggleGUI);

    // Scene
    const scene = new THREE.Scene();
    // to help visualize centering the text
    const axesHelper = new THREE.AxesHelper();
    

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      1000
    );
    camera.position.z = 3;
    scene.add(camera);

    const textureLoader = new THREE.TextureLoader();
    const matcatTexture = textureLoader.load(
      'static/textures/matcaps/4.png'
    );
    const donutmatcapTexture = textureLoader.load(
      'static/textures/matcaps/7.png'
    )
    donutmatcapTexture.colorSpace = THREE.SRGBColorSpace;
    matcatTexture.colorSpace = THREE.SRGBColorSpace;
    // 3D text
    const fontLoader = new FontLoader();
    fontLoader.load(
      'fonts/helvetiker_regular.typeface.json',
      (font_helvetica) => {
        const textGeometry = new TextGeometry(
          'SYBAU',
          {
            font : font_helvetica,
            size : 0.5,
            depth : 0.2,
            curveSegments : 8,
            bevelEnabled : true,
            bevelThickness : 0.03,
            bevelSize : 0.02,
            bevelOffset : 0,
            bevelSegments : 3


          }
        )

        textGeometry.computeBoundingBox();
        textGeometry.translate(
          (textGeometry.boundingBox.max.x - 0.02) * -0.5,
          (textGeometry.boundingBox.max.y - 0.02) * -0.5,
          (textGeometry.boundingBox.max.z - 0.03) * -0.5
        )

        // textGeometry.center(); <-- easier way...
        const textMaterial = new THREE.MeshMatcapMaterial({
          wireframe : true,
          matcap : matcatTexture

        });
        const startertext = new THREE.Mesh(textGeometry, textMaterial);
        scene.add(startertext);
        // Donuts material creation vv
        const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
        const donutMaterial = new THREE.MeshMatcapMaterial({
          
          matcap : donutmatcapTexture
        }) // move material creation for donut outside of the loop for better time optimization

        for(let i = 0; i < 100; i++)
          {
          const donut = new THREE.Mesh(donutGeometry, donutMaterial);

          donut.position.x = (Math.random() - 0.5) * 10;
          donut.position.y = (Math.random() - 0.5) * 10;
          donut.position.z = (Math.random() - 0.5) * 10;
          donut.rotation.x = Math.random() * Math.PI;// math.pi to do half a rotation
          donut.rotation.y = Math.random() * Math.PI;

          const scale = Math.random();
          donut.scale.set(scale, scale, scale); // .set(x, y, z)?? <-- i think

          scene.add(donut);
        }
      }
    )

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 1);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Resize handler
    const handleResize = () => {
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      console.log('window is resized');
    };
    window.addEventListener('resize', handleResize);

    // Fullscreen toggle
    const handleDblClick = () => {
      const fullscreenElement =
        document.fullscreenElement || document.webkitFullscreenElement;

      if (!fullscreenElement) {
        if (canvasRef.current.requestFullscreen) {
          canvasRef.current.requestFullscreen();
        } else if (canvasRef.current.webkitRequestFullscreen) {
          canvasRef.current.webkitRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      }
      console.log('double clicked');
    };
    window.addEventListener('dblclick', handleDblClick);

    // Animation loop
    const clock = new THREE.Clock();
    const tick = () => {
      const elapsedTime = clock.getElapsedTime();

      // Example animation
    //   cube.rotation.y = elapsedTime;
    //   cube.rotation.x = elapsedTime * 0.5;

      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    };
    tick();

    return () => {
      gui.destroy();
      window.removeEventListener('keydown', toggleGUI);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('dblclick', handleDblClick);
      renderer.dispose();
      // geometry.dispose();
      // material.dispose();
    };

}, []);

  return (
    <div>
      <canvas
        ref={canvasRef}
        className="exampleOnScreen"
        id="example_canvas"
      ></canvas>
    </div>
  )
}

export default ThreeDtext