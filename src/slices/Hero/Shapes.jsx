"use client";

import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Float, Environment, TransformControls } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import CustomShaderMaterial from "./ShaderMaterial"; // Import your shader

// Center sphere component that uses your custom shader material.
function CenterSphere({ position, geometry, r }) {
  const meshRef = useRef();
  const [visible, setVisible] = useState(false);
  // Create and store an instance of your custom shader material.
  const materialRef = useRef(new CustomShaderMaterial());

  // Update the shader's iTime uniform each frame.
  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.iTime.value = clock.getElapsedTime();
    }
  });

  const handlePointerDown = (e) => {
    if (materialRef.current) {
      // Set mouse x, y and flag (z component) to indicate pressed.
      materialRef.current.uniforms.iMouse.value.set(
        e.clientX,
        e.clientY,
        1,
        0
      );
    }
  };

  const handlePointerMove = (e) => {
    if (materialRef.current && materialRef.current.uniforms.iMouse.value.z === 1) {
      materialRef.current.uniforms.iMouse.value.set(
        e.clientX,
        e.clientY,
        1, // keep the click flag
        0
      );
    }
  };
  

  const handlePointerUp = (e) => {
    if (materialRef.current) {
      // Release the click flag.
      materialRef.current.uniforms.iMouse.value.z = 0;
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      setVisible(true);
      gsap.fromTo(
        meshRef.current.scale,
        { x: 0, y: 0, z: 0 },
        { x: 1, y: 1, z: 1, duration: 1, ease: "elastic.out(1, 0.3)", delay: 0.3 }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <group position={position} ref={meshRef}>
        <mesh
        geometry={geometry}
        // onPointerDown={handlePointerDown}
        // onPointerMove={handlePointerMove}
        // onPointerUp={handlePointerUp}
        castShadow={false}
        receiveShadow={false}>
        <primitive object={materialRef.current} attach="material" />
        </mesh>

    </group>
  );
}

// Interactive geometry component for the other shapes.
function Geometry({ r, position, geometry, materials, soundEffects }) {
    const meshRef = useRef();
    const orbitRef = useRef();
    const [visible, setVisible] = useState(false);
  
    // Convert the provided position (an array) into polar coordinates.
    // We assume position is [x, y, z] (already multiplied as needed).
    const [initialX, initialY, initialZ] = position;
    const initialRadius = Math.sqrt(initialX * initialX + initialZ * initialZ);
    const initialAngle = Math.atan2(initialZ, initialX);
    // Set an orbit speed (radians per second)
    const orbitSpeed = 0.3;
  
    // Update the orbit group's position every frame.
    useFrame(({ clock }) => {
      const t = clock.getElapsedTime();
      const angle = initialAngle + orbitSpeed * t;
    //   const angle = initialAngle;
      if (orbitRef.current) {
        const orbitScale = 0.5; // Change this factor to adjust the orbit's radius
        orbitRef.current.position.x = orbitScale * initialRadius * Math.cos(angle);
        orbitRef.current.position.z = orbitScale * initialRadius * Math.sin(angle);

        // Keep the original Y position.
        orbitRef.current.position.y = initialY;
      }
    });
  
    // The rest of your interactive geometry code:
    const getRandomMaterial = () => gsap.utils.random(materials);
    const startingMaterial = getRandomMaterial();
  
    function handleClick(e) {
      const mesh = e.object;
      gsap.utils.random(soundEffects).play();
      gsap.to(mesh.rotation, {
        x: `+=${gsap.utils.random(0, 2)}`,
        y: `+=${gsap.utils.random(0, 2)}`,
        z: `+=${gsap.utils.random(0, 2)}`,
        duration: 1.3,
        ease: "elastic.out(1,0.3)",
        yoyo: true,
      });
      mesh.material = getRandomMaterial();
    }
  
    const handlePointerOver = () => {
      document.body.style.cursor = "pointer";
    };
  
    const handlePointerOut = () => {
      document.body.style.cursor = "default";
    };
  
    useEffect(() => {
      const ctx = gsap.context(() => {
        setVisible(true);
        gsap.fromTo(
          meshRef.current.scale,
          { x: 0, y: 0, z: 0 },
          { x: 1, y: 1, z: 1, duration: 1, ease: "elastic.out(1, 0.3)", delay: 0.3 }
        );
      });
      return () => ctx.revert();
    }, []);
  
    return (
      // The orbit group is controlled by our useFrame hook.
      <group ref={orbitRef}>
        {/* The local group holds the mesh in its original position (here at [0,0,0]) */}
        <group position={[0, 0, 0]}>
          <Float speed={5 * r} rotationIntensity={6 * r} floatIntensity={5 * r}>
            <mesh 
              ref={meshRef}
              geometry={geometry}
              onClick={handleClick}
              onPointerOver={handlePointerOver}
              onPointerOut={handlePointerOut}
              visible={visible}
              material={startingMaterial}
            />
          </Float>
        </group>
      </group>
    );
  }
  

// Combines the center sphere with the interactive geometries.
function Geometries() {
  // Define the center sphere.
  // After: center plane geometry (adjust width, height, and segments as desired)
  
  const centerGeometry = {
    position: [0, 0, 0],
    r: 0.3,
    geometry: new THREE.PlaneGeometry(50, 30, 64, 64),
  };
  

  // Define the other interactive geometries.
  const otherGeometries = [
    { position: [4, -1.25, 2], r: 0.4, geometry: new THREE.DodecahedronGeometry(0.5) },
    { position: [-1.9, 2, -3.5], r: 0.6, geometry: new THREE.DodecahedronGeometry(0.7) },
    { position: [-1.9, -0.4, -3.5], r: 0.5, geometry: new THREE.OctahedronGeometry(0.9) },
    { position: [2.3, 1.5, 3.2], r: 0.5, geometry: new THREE.OctahedronGeometry(0.6) },
    { position: [1.8, 1.1, -2.4], r: 0.7, geometry: new THREE.OctahedronGeometry(0.4) },
  ];

  // Materials for interactive shapes.
  const materials = [
    new THREE.MeshNormalMaterial(),
    new THREE.MeshStandardMaterial({ color: 0x2ecc71, roughness: 0 }),
    new THREE.MeshStandardMaterial({ color: 0xc23616, roughness: 0.4 }),
    new THREE.MeshStandardMaterial({ color: 0x9c88ff, roughness: 0.1 }),
    new THREE.MeshStandardMaterial({ color: 0xe1b12c, roughness: 0.1 }),
    new THREE.MeshStandardMaterial({ color: 0x273c75, roughness: 0.3 }),
    new THREE.MeshStandardMaterial({ color: 0x00a8ff, roughness: 0, metalness: 0.5 }),
    new THREE.MeshStandardMaterial({ color: 0x2f3640, roughness: 0.2, metalness: 0.7 }),
  ];

  const soundEffects = [
    new Audio("/sounds/knock1.ogg"),
    new Audio("/sounds/knock2.ogg"),
    new Audio("/sounds/knock3.ogg"),
    new Audio("/sounds/knock4.ogg"),
    new Audio("/sounds/knock5.ogg"),
  ];

  return (
    <>
      <CenterSphere
        key="center-sphere"
        position={centerGeometry.position.map((p) => p * 2)}
        r={centerGeometry.r}
        geometry={centerGeometry.geometry}
      />
      {otherGeometries.map(({ position, r, geometry }) => (
        <Geometry
          key={JSON.stringify(position)}
          position={position.map((p) => p * 2)}
          r={r}
          geometry={geometry}
          materials={materials}
          soundEffects={soundEffects}
        />
      ))}
    </>
  );
}

export default function Shapes() {
  return (
    <div className="row-span-1 row-start-1 -mt-9 aspect-square md:col-span-1 md:col-start-2 md:mt-0">
      <Canvas
        className="z-0"
        shadows
        gl={{ antialias: false }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 25], fov: 30, near: 1, far: 40 }}
      >
        <Suspense fallback={null}>
          <Geometries />
          <ContactShadows
            position={[0, -3.5, 0]}
            opacity={0.65}
            scale={40}
            blur={1}
            far={9}
          />
          <Environment preset="studio" />
        </Suspense>
      </Canvas>
    </div>
  );
}
