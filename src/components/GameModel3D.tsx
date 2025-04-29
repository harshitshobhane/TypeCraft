
import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Float } from '@react-three/drei';
import { Mesh } from 'three';

const KeyboardModel = () => {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  // Simulate a keyboard model with basic shapes
  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += 0.005;
  });
  
  return (
    <group>
      {/* Base keyboard */}
      <mesh 
        ref={meshRef}
        onPointerOver={() => setHovered(true)} 
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.05 : 1}
      >
        <boxGeometry args={[3, 0.2, 1.2]} />
        <meshStandardMaterial 
          color={hovered ? "#a17fff" : "#8B5CF6"} 
          metalness={0.8} 
          roughness={0.2} 
        />
      </mesh>
      
      {/* Keys */}
      {[...Array(20)].map((_, i) => (
        <mesh 
          key={i} 
          position={[
            -1.25 + (i % 10) * 0.25,
            0.15,
            -0.4 + Math.floor(i / 10) * 0.4
          ]}
          scale={[0.15, 0.1, 0.15]}
        >
          <boxGeometry />
          <meshStandardMaterial 
            color="#D946EF" 
            emissive="#D946EF"
            emissiveIntensity={0.3}
            metalness={0.5} 
            roughness={0.4} 
          />
        </mesh>
      ))}

      {/* Decorative elements */}
      <mesh position={[0, -0.15, 0]} scale={[3.2, 0.1, 1.4]}>
        <boxGeometry />
        <meshStandardMaterial color="#1A1F2C" metalness={0.5} roughness={0.4} />
      </mesh>
    </group>
  );
};

interface GameModelProps {
  className?: string;
}

export const GameModel3D = ({ className }: GameModelProps) => {
  return (
    <div className={`w-full h-[300px] md:h-[400px] ${className}`}>
      <Canvas camera={{ position: [0, 1.5, 4], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <Float
          speed={1.5}
          rotationIntensity={0.2}
          floatIntensity={0.5}
        >
          <KeyboardModel />
        </Float>
        <Environment preset="city" />
        <OrbitControls 
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2.3}
        />
      </Canvas>
    </div>
  );
};
