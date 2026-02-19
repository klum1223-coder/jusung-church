'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

function GlowingCrossModel() {
    const group = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (group.current) {
            const t = state.clock.getElapsedTime();
            group.current.rotation.y = Math.sin(t * 0.1) * 0.1;
            group.current.rotation.z = Math.sin(t * 0.05) * 0.05;
        }
    });

    return (
        <group ref={group}>
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5} floatingRange={[-0.2, 0.2]}>
                {/* Vertical Beam */}
                <mesh position={[0, 0, 0]}>
                    <boxGeometry args={[0.3, 4, 0.3]} />
                    <meshStandardMaterial
                        color="#fbbf24"
                        emissive="#b45309"
                        emissiveIntensity={2}
                        toneMapped={false}
                    />
                </mesh>
                {/* Horizontal Beam */}
                <mesh position={[0, 0.8, 0]}>
                    <boxGeometry args={[2.5, 0.3, 0.3]} />
                    <meshStandardMaterial
                        color="#fbbf24"
                        emissive="#b45309"
                        emissiveIntensity={2}
                        toneMapped={false}
                    />
                </mesh>
                {/* Central Core Light */}
                <pointLight position={[0, 0.8, 0.5]} color="#fbbf24" intensity={5} distance={10} decay={2} />
            </Float>
        </group>
    );
}

export default function AbrahamPromiseScene() {
    return (
        <div className="fixed inset-0 w-full h-full -z-50 bg-[#020205]">
            <Canvas camera={{ position: [0, 0, 7], fov: 45 }} dpr={[1, 2]}>
                <color attach="background" args={['#020205']} />

                {/* The Promise: Stars in the Sky */}
                <Stars radius={80} depth={50} count={5000} factor={4} saturation={0} fade speed={0.5} />

                {/* "As the sand on the seashore" - Ground particles */}
                <Sparkles
                    count={800}
                    scale={[25, 0.5, 25]}
                    position={[0, -3.5, 0]}
                    size={3}
                    speed={0.2}
                    opacity={0.4}
                    color="#f59e0b"
                />

                {/* Concentration around the Cross */}
                <Sparkles
                    count={200}
                    scale={[4, 6, 4]}
                    position={[0, 0.5, 0]}
                    size={2}
                    speed={0.8}
                    opacity={0.6}
                    color="#fbbf24"
                />

                <ambientLight intensity={0.1} />
                <GlowingCrossModel />

                <fog attach="fog" args={['#020205', 5, 25]} />
            </Canvas>
            {/* Vignette Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)] pointer-events-none" />
        </div>
    );
}
