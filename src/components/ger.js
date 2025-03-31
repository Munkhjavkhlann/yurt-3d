"use client";
import * as THREE from "three";
import { useRef, useState } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { EnvironmentScene } from "./Environment";

export default function TestYurt() {
  const [visibility, setVisibility] = useState({
    floor: true,
    frontDoor: true,
    backDoor: true,
    leftWindow: true,
    rightWindow: true,
    roof: true,
    stair: true,
    wallFoundation: true,
    wallRight: true,
    wallLeft: true,
  });

  const toggleComponent = (component) => {
    setVisibility((prev) => ({
      ...prev,
      [component]: !prev[component],
    }));
  };

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <Canvas shadows camera={{ position: [-20, 10, 15], fov: 25 }}>
        <color attach="background" args={["skyblue"]} />
        <Yurt visibility={visibility} />
        <EnvironmentScene />
        <OrbitControls makeDefault />
      </Canvas>

      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          width: "200px",
          background: "rgba(255, 255, 255, 0.8)",
          padding: "10px",
          borderRadius: "0 0 0 5px",
        }}
      >
        <h3 style={{ margin: "0 0 10px 0" }}>Components</h3>
        {Object.entries(visibility).map(([component, isVisible]) => (
          <div
            key={component}
            style={{ margin: "5px 0", display: "flex", alignItems: "center" }}
          >
            <input
              type="checkbox"
              checked={isVisible}
              onChange={() => toggleComponent(component)}
              style={{ marginRight: "5px" }}
            />
            <label>{component}</label>
          </div>
        ))}
      </div>
    </div>
  );
}

function Yurt({ visibility, ...props }) {
  const gltf = useLoader(GLTFLoader, "/assets/gltf/tsomtsog-ger.glb");
  const testWall = useLoader(GLTFLoader, "/assets/gltf/burees-test1.glb");
  const modelRef = useRef();

  const floor = gltf.scene.getObjectByName("floor");
  const frontDoor = gltf.scene.getObjectByName("door");
  const backDoor = gltf.scene.getObjectByName("back-door");
  const leftWindow = gltf.scene.getObjectByName("left-window");
  const rightWindow = gltf.scene.getObjectByName("right-window");
  const roof = gltf.scene.getObjectByName("roof");
  const stair = gltf.scene.getObjectByName("stairs");
  const wallFoundation = gltf.scene.getObjectByName("wall-foundation");
  const wallRight = gltf.scene.getObjectByName("wall-right");
  const wallLeft = gltf.scene.getObjectByName("wall-left");

  const frontLeft = testWall.scene.getObjectByName("front-left-burees");
  const frontRight = testWall.scene.getObjectByName("front-right-burees");
  const backLeft = testWall.scene.getObjectByName("back-left-burees");
  const backRight = testWall.scene.getObjectByName("back-right-burees");
  const roofBurees = testWall.scene.getObjectByName("roof-burees");

  if (floor) {
    floor.visible = visibility.floor;
  }
  if (frontDoor) {
    frontDoor.visible = visibility.frontDoor;
  }
  if (backDoor) {
    backDoor.visible = visibility.backDoor;
  }
  if (leftWindow) {
    leftWindow.visible = visibility.leftWindow;
  }
  if (rightWindow) {
    rightWindow.visible = visibility.rightWindow;
  }
  if (roof) {
    roof.visible = visibility.roof;
  }
  if (stair) {
    stair.visible = visibility.stair;
  }
  if (wallFoundation) {
    wallFoundation.visible = visibility.wallFoundation;
  }
  if (wallRight) {
    wallRight.visible = visibility.wallRight;
  }
  if (wallLeft) {
    wallLeft.visible = visibility.wallLeft;
  }

  return (
    <group ref={modelRef} {...props}>
      <primitive
        object={gltf.scene}
        castShadow
        receiveShadow
        position={[-0.07, 0, 0.35]}
      />
      <primitive object={backLeft} castShadow receiveShadow />
      <primitive object={backRight} castShadow receiveShadow />
      <primitive object={frontLeft} castShadow receiveShadow />
      <primitive
        object={frontRight}
        castShadow
        receiveShadow
        // position={[0, -0.5, -2]}
      />
      <primitive object={roofBurees} castShadow receiveShadow />
    </group>
  );
}
