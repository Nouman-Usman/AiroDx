import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshTransmissionMaterial, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

function RibCage() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  const ribs = useMemo(() => {
    const ribData: { y: number; scaleX: number; scaleZ: number }[] = [];
    for (let i = 0; i < 12; i++) {
      const t = i / 11;
      const scaleX = 0.7 + Math.sin(t * Math.PI) * 0.5;
      const scaleZ = 0.5 + Math.sin(t * Math.PI) * 0.35;
      ribData.push({ y: 1.8 - i * 0.3, scaleX, scaleZ });
    }
    return ribData;
  }, []);

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Spine */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 3.6, 8]} />
        <meshPhysicalMaterial
          color="#4fc3f7"
          emissive="#1565c0"
          emissiveIntensity={0.3}
          transparent
          opacity={0.7}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>

      {/* Vertebrae */}
      {Array.from({ length: 18 }, (_, i) => (
        <mesh key={`vert-${i}`} position={[0, 2.1 - i * 0.2, 0]}>
          <boxGeometry args={[0.18, 0.06, 0.14]} />
          <meshPhysicalMaterial
            color="#4fc3f7"
            emissive="#0d47a1"
            emissiveIntensity={0.4}
            transparent
            opacity={0.65}
            roughness={0.3}
          />
        </mesh>
      ))}

      {/* Ribs */}
      {ribs.map((rib, i) => (
        <group key={`rib-${i}`} position={[0, rib.y, 0]}>
          {/* Left rib */}
          <mesh rotation={[0, 0, Math.PI * 0.06]}>
            <torusGeometry args={[rib.scaleX * 0.65, 0.025, 8, 32, Math.PI * 0.85]} />
            <meshPhysicalMaterial
              color="#4fc3f7"
              emissive="#1565c0"
              emissiveIntensity={0.35}
              transparent
              opacity={0.55}
              roughness={0.25}
              metalness={0.05}
            />
          </mesh>
          {/* Right rib */}
          <mesh rotation={[0, Math.PI, Math.PI * 0.06]}>
            <torusGeometry args={[rib.scaleX * 0.65, 0.025, 8, 32, Math.PI * 0.85]} />
            <meshPhysicalMaterial
              color="#4fc3f7"
              emissive="#1565c0"
              emissiveIntensity={0.35}
              transparent
              opacity={0.55}
              roughness={0.25}
              metalness={0.05}
            />
          </mesh>
        </group>
      ))}

      {/* Sternum */}
      <mesh position={[0, 0.9, 0.55]}>
        <boxGeometry args={[0.08, 1.8, 0.04]} />
        <meshPhysicalMaterial
          color="#4fc3f7"
          emissive="#1565c0"
          emissiveIntensity={0.3}
          transparent
          opacity={0.6}
          roughness={0.3}
        />
      </mesh>

      {/* Pelvis outline */}
      <mesh position={[0, -1.2, 0]} rotation={[0.2, 0, 0]}>
        <torusGeometry args={[0.55, 0.04, 8, 32, Math.PI]} />
        <meshPhysicalMaterial
          color="#4fc3f7"
          emissive="#0d47a1"
          emissiveIntensity={0.35}
          transparent
          opacity={0.5}
          roughness={0.3}
        />
      </mesh>

      {/* Shoulder blades */}
      {[-1, 1].map((side) => (
        <mesh key={`shoulder-${side}`} position={[side * 0.5, 1.7, -0.15]} rotation={[0.3, side * 0.2, side * 0.4]}>
          <sphereGeometry args={[0.25, 8, 8, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshPhysicalMaterial
            color="#4fc3f7"
            emissive="#1565c0"
            emissiveIntensity={0.3}
            transparent
            opacity={0.4}
            roughness={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

function GlowingSphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.MeshPhysicalMaterial;
      material.emissiveIntensity = 0.15 + Math.sin(state.clock.elapsedTime * 2) * 0.08;
    }
  });

  return (
    <mesh ref={meshRef} scale={2.8}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshPhysicalMaterial
        color="#0a1628"
        emissive="#1e3a5f"
        emissiveIntensity={0.15}
        transparent
        opacity={0.12}
        roughness={0.1}
        metalness={0.9}
        side={THREE.BackSide}
      />
    </mesh>
  );
}

function ScanLine() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 2;
      const material = meshRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.15 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[0, 0, 0]}>
      <planeGeometry args={[4, 0.02]} />
      <meshBasicMaterial color="#4fc3f7" transparent opacity={0.2} side={THREE.DoubleSide} />
    </mesh>
  );
}

function Particles() {
  const count = 150;
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2 + Math.random() * 1.2;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      const t = state.clock.elapsedTime * 0.3 + i * 0.1;
      dummy.position.set(
        positions[i * 3] + Math.sin(t) * 0.05,
        positions[i * 3 + 1] + Math.cos(t * 1.3) * 0.05,
        positions[i * 3 + 2] + Math.sin(t * 0.7) * 0.05
      );
      dummy.scale.setScalar(0.008 + Math.sin(t * 2) * 0.004);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#64b5f6" transparent opacity={0.6} />
    </instancedMesh>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} color="#e3f2fd" />
      <pointLight position={[-3, 2, 4]} intensity={0.8} color="#42a5f5" distance={10} />
      <pointLight position={[3, -2, -4]} intensity={0.4} color="#7c4dff" distance={10} />

      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
        <GlowingSphere />
        <RibCage />
        <ScanLine />
        <Particles />
      </Float>

      <ContactShadows position={[0, -2.5, 0]} opacity={0.2} scale={8} blur={2} color="#1565c0" />
    </>
  );
}

export default function XRayScene({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
