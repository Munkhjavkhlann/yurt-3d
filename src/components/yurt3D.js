"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const Yurt3D = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    let scene, camera, renderer, controls;

    const init = () => {
      // Scene setup
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      mountRef.current.appendChild(renderer.domElement);

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(10, 20, 15);
      scene.add(directionalLight);

      // Yurt structure
      createWalls();
      createRoofStructure();
      createDoorWithWindow();
      createWindows();
      createFloor();

      // Camera controls
      controls = new OrbitControls(camera, renderer.domElement);
      camera.position.set(0, 5, 15);
      controls.update();

      setupColorControls();

      window.addEventListener("resize", onWindowResize);
    };

    const createWalls = () => {
      const wallGeometry = new THREE.CylinderGeometry(5, 4.8, 3, 32, 1, true);
      const wallMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
      });
      const walls = new THREE.Mesh(wallGeometry, wallMaterial);
      walls.position.y = 1.5;
      scene.add(walls);
      walls.userData.isWall = true;

      const latticeGeometry = new THREE.SphereGeometry(0.05, 6, 6);
      const latticeMaterial = new THREE.MeshBasicMaterial({
        color: 0x444444,
      });

      for (let i = 0; i < 32; i++) {
        const angle = (i / 32) * Math.PI * 2;
        const x = Math.cos(angle) * 4.9;
        const z = Math.sin(angle) * 4.9;
        const lattice = new THREE.Mesh(latticeGeometry, latticeMaterial);
        lattice.position.set(x, 1.5, z);
        scene.add(lattice);
      }
    };

    const createRoofStructure = () => {
      const roofGeometry = new THREE.ConeGeometry(5, 3, 32);
      const roofMaterial = new THREE.MeshPhongMaterial({
        color: 0xcc9933,
        transparent: true,
        opacity: 0.8,
      });
      const roof = new THREE.Mesh(roofGeometry, roofMaterial);
      roof.position.y = 4.5;
      scene.add(roof);

      const crownGeometry = new THREE.CylinderGeometry(0.5, 0.7, 0.3, 16);
      const crownMaterial = new THREE.MeshStandardMaterial({
        color: 0x666666,
      });
      const crown = new THREE.Mesh(crownGeometry, crownMaterial);
      crown.position.y = 5.7;
      scene.add(crown);

      const textureLoader = new THREE.TextureLoader();
      const woodTexture = textureLoader.load(
        "https://imgur.com/gallery/70s-style-wood-paneling-texture-olU7LPg"
      );

      woodTexture.wrapS = THREE.RepeatWrapping;
      woodTexture.wrapT = THREE.RepeatWrapping;
      woodTexture.repeat.set(2, 2);

      const poleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 5.66, 8);
      const poleMaterial = new THREE.MeshStandardMaterial({
        map: woodTexture,
        roughness: 0.8,
        metalness: 0.0,
      });

      const numPoles = 60;
      for (let i = 0; i < numPoles; i++) {
        const angle = (i / numPoles) * Math.PI * 2;
        const x = Math.cos(angle) * 3;
        const z = Math.sin(angle) * 3;
        const pole = new THREE.Mesh(poleGeometry, poleMaterial);
        pole.position.set(x, 4.17, z);
        const target = new THREE.Vector3(0, 6, 0);
        pole.lookAt(target);
        pole.rotateX(-Math.PI / 2);
        scene.add(pole);
      }
    };

    const createDoorWithWindow = () => {
      const doorFrameGeometry = new THREE.BoxGeometry(1.1, 2.2, 0.2);
      const doorFrameMaterial = new THREE.MeshPhongMaterial({
        color: 0x663300,
      });
      const doorFrame = new THREE.Mesh(doorFrameGeometry, doorFrameMaterial);
      doorFrame.position.z = 4.95;
      doorFrame.position.y = 1;
      scene.add(doorFrame);

      const windowGeometry = new THREE.BoxGeometry(0.8, 0.5, 0.01);
      const windowMaterial = new THREE.MeshPhongMaterial({
        color: 0x99ccff,
        transparent: true,
        opacity: 0.7,
      });
      const doorWindow = new THREE.Mesh(windowGeometry, windowMaterial);
      doorWindow.position.z = 5.06;
      doorWindow.position.y = 1.5;
      scene.add(doorWindow);
    };

    const createWindows = () => {
      const windowGeometry = new THREE.PlaneGeometry(0.6, 0.6);
      const windowMaterial = new THREE.MeshPhongMaterial({
        color: 0x99ccff,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide,
      });

      for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
        const window = new THREE.Mesh(windowGeometry, windowMaterial);
        window.position.set(Math.cos(angle) * 4.9, 1.5, Math.sin(angle) * 4.9);
        window.rotation.y = angle + Math.PI;
        window.renderOrder = 1;
        scene.add(window);
      }
    };

    const createFloor = () => {
      const floorThickness = 0.2;
      const floorGeometry = new THREE.CylinderGeometry(
        4.8,
        4.8,
        floorThickness,
        32
      );
      const floorMaterial = new THREE.MeshPhongMaterial({
        color: 0x886644,
        side: THREE.DoubleSide,
      });
      const floor = new THREE.Mesh(floorGeometry, floorMaterial);
      floor.position.y = -floorThickness / 2;
      scene.add(floor);
    };

    const setupColorControls = () => {
      const materials = {};

      const wall = scene.children.find((obj) => obj.userData.isWall);
      if (wall) materials.wallColor = wall.material;

      const roof = scene.children.find(
        (obj) => obj.type === "Mesh" && obj.geometry.type === "ConeGeometry"
      );
      if (roof) materials.roofColor = roof.material;

      const door = scene.children.find((obj) => obj.position.z > 4.9);
      if (door) materials.doorColor = door.material;

      const windowObj = scene.children.find(
        (obj) => obj.material && obj.material.opacity === 0.7
      );
      if (windowObj) materials.windowColor = windowObj.material;

      document.querySelectorAll('input[type="color"]').forEach((input) => {
        input.addEventListener("input", (e) => {
          const material = materials[e.target.id];
          if (material) material.color.set(e.target.value);
        });
      });
    };

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    init();
    animate();

    return () => {
      window.removeEventListener("resize", onWindowResize);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <>
      <div id="controls">
        <label>
          Wall: <input type="color" id="wallColor" value="#ffffff" />
        </label>
        <label>
          Roof: <input type="color" id="roofColor" value="#cc9933" />
        </label>
        <label>
          Door: <input type="color" id="doorColor" value="#663300" />
        </label>
        <label>
          Window: <input type="color" id="windowColor" value="#99ccff" />
        </label>
      </div>
      <div ref={mountRef}></div>
    </>
  );
};

export default Yurt3D;
