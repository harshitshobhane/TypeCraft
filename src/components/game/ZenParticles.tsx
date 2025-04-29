
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface ZenParticlesProps {
  intensity?: number;
  reactToTyping?: boolean;
  typingEvent?: boolean;
}

export const ZenParticles: React.FC<ZenParticlesProps> = ({ 
  intensity = 1.0,
  reactToTyping = false,
  typingEvent = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  
  // Initial setup of the scene
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 20;
    cameraRef.current = camera;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    
    const posArray = new Float32Array(particlesCount * 3);
    const colorArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
      // Position scatter in a sphere
      posArray[i] = (Math.random() - 0.5) * 25;
      
      // Color - soft blue/purple palette
      if (i % 3 === 0) colorArray[i] = 0.5 + Math.random() * 0.2; // R
      if (i % 3 === 1) colorArray[i] = 0.7 + Math.random() * 0.3; // G
      if (i % 3 === 2) colorArray[i] = 0.9 + Math.random() * 0.1; // B
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({ 
      size: 0.08,
      transparent: true,
      opacity: 0.7,
      vertexColors: true,
      blending: THREE.AdditiveBlending
    });
    
    const particleMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleMesh);
    particlesRef.current = particleMesh;
    
    // Handle window resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Animation loop
    let animationId: number;
    
    const animate = () => {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current || !particlesRef.current) return;
      
      animationId = requestAnimationFrame(animate);
      
      // Gentle rotation
      particlesRef.current.rotation.y += 0.0005 * intensity;
      particlesRef.current.rotation.x += 0.0002 * intensity;
      
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      if (particlesGeometry) {
        particlesGeometry.dispose();
      }
      
      if (particlesMaterial) {
        particlesMaterial.dispose();
      }
    };
  }, []);
  
  // React to typing events
  useEffect(() => {
    if (!particlesRef.current || !reactToTyping) return;
    
    // Dynamic response to typing
    const handleTypingPulse = () => {
      if (!particlesRef.current) return;
      
      // Gentle pulse effect
      const currentScale = particlesRef.current.scale.x;
      particlesRef.current.scale.set(currentScale * 1.1, currentScale * 1.1, currentScale * 1.1);
      
      // Return to normal
      setTimeout(() => {
        if (!particlesRef.current) return;
        particlesRef.current.scale.set(1, 1, 1);
      }, 300);
    };
    
    if (typingEvent) {
      handleTypingPulse();
    }
  }, [typingEvent, reactToTyping]);
  
  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
};
