"use client";
import * as THREE from "three";
import { useRef } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, PivotControls } from "@react-three/drei";
import { Geometry, Base, Subtraction, Addition } from "@react-three/csg";
import { EnvironmentScene } from "./Environment";

const floor = new THREE.CylinderGeometry(1, 1, 1, 32);
const pole = new THREE.CylinderGeometry(1, 1, 1);
const box = new THREE.BoxGeometry();
const doorCyl = new THREE.CylinderGeometry(1, 1, 2, 20);

export default function TestYurt() {
  return (
    <Canvas shadows camera={{ position: [-45, 10, 15], fov: 35 }}>
      <color attach="background" args={["skyblue"]} />
      <Yurt />
      <EnvironmentScene />
      <OrbitControls makeDefault />
    </Canvas>
  );
}

function Yurt(props) {
  const csg = useRef();
  return (
    <mesh receiveShadow castShadow {...props}>
      <Geometry ref={csg} computeVertexNormals>
        <Base
          name="floor"
          geometry={floor}
          scale={[5, 0.1, 5]}
          position={[0, -1.35, 0]}
        />
        <Addition name="walls">
          <Geometry>
            <Base
              name="outerWall"
              geometry={new THREE.CylinderGeometry(5, 5, 3, 32)}
              position={[0, 0.2, 0]}
            />
            <Subtraction
              name="innerWall"
              geometry={new THREE.CylinderGeometry(4.9, 4.9, 3, 32)}
              position={[0, 0.2, 0]}
            />
          </Geometry>
        </Addition>

        <Addition
          name="pole1"
          geometry={pole}
          scale={[0.1, 3, 0.1]}
          position={[0, 0.1, -1.2]}
        />
        <Addition
          name="pole2"
          geometry={pole}
          scale={[0.1, 3, 0.1]}
          position={[0, 0.1, 1.2]}
        />

        <Addition name="roof">
          <Geometry>
            <Base
              geometry={new THREE.ConeGeometry(5, 3.1, 32)}
              position={[0, 3.25, 0]}
            />
            <Subtraction
              geometry={new THREE.ConeGeometry(4.8, 3.1, 32)}
              position={[0, 3.25, 0]}
            />
          </Geometry>
        </Addition>

        <Subtraction
          name="toonoOpening"
          geometry={new THREE.CylinderGeometry(1, 1, 0.6, 32)}
          scale={[1.3, 3.2, 1.3]}
          position={[0, 4, 0]}
        />
        <PivotControls
          depthTest={false}
          anchor={[0, 0, 0]}
          onDrag={() => csg.current.update()}
        >
          <Door
            rotation={[0, Math.PI / 2, 0]}
            position={[-5, -0.25, 0]}
            scale={[1.2, 0.9, 1.2]}
          />
        </PivotControls>
      </Geometry>
      <meshStandardMaterial
        roughness={0.5}
        metalness={0.1}
        envMapIntensity={0.25}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

const Door = (props) => {
  // Load wood texture
  const texture = useLoader(THREE.TextureLoader, "/door-texture.jpeg");
  //   const texture = THREE.TextureLoader.load("/door-texture.jpeg");
  // Adjust texture settings
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 1);

  // Create material with texture
  const woodMaterial = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.8,
    metalness: 0.05,
  });

  return (
    <Subtraction {...props}>
      <Geometry>
        <Base geometry={box} scale={[1, 2, 1]} material={woodMaterial} />
        <Addition
          geometry={doorCyl}
          scale={0.5}
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, 1, 0]}
          material={woodMaterial}
        />
      </Geometry>
    </Subtraction>
  );
};
